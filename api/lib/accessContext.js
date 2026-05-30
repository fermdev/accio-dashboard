import {
  ACCESS_PROTOCOL_DOCS,
  fetchAllPools,
  formatPoolContext,
  getProtocolSummary,
  resolvePoolEntries,
  searchPoolsByName,
  searchRegistryByText,
} from './accessProtocol.js';

const SOLANA_ADDRESS_RE = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/g;

const ACCESS_KEYWORDS =
  /\b(access\s*protocol|acs\b|staking|stake\s*pool|kreator|creator|supporter|subscriber|hub\.accessprotocol|min(?:imum)?\s*stake|apy)\b/i;

function wantsProtocolOverview(text) {
  return (
    ACCESS_KEYWORDS.test(text) &&
    !SOLANA_ADDRESS_RE.test(text) &&
    text.split(/\s+/).length >= 2
  );
}

export async function buildAccessContext(userMessage) {
  if (!userMessage?.trim()) return '';

  const sections = [];
  const text = userMessage.trim();

  sections.push(
    [
      '## Access Protocol reference',
      `- Docs: ${ACCESS_PROTOCOL_DOCS.guide}`,
      `- API docs: ${ACCESS_PROTOCOL_DOCS.api}`,
      `- Hub: ${ACCESS_PROTOCOL_DOCS.hub}`,
      `- Program ID: \`${ACCESS_PROTOCOL_DOCS.programId}\``,
      `- Public Hub API base: ${ACCESS_PROTOCOL_DOCS.hubApi}`,
      '- Users stake **ACS** tokens into creator **Stake Pools** for content access and rewards.',
    ].join('\n')
  );

  const addresses = [...new Set(text.match(SOLANA_ADDRESS_RE) || [])];

  if (addresses.length > 0) {
    const pools = await fetchAllPools();
    for (const addr of addresses.slice(0, 3)) {
      const pool = pools.find((p) => p.Pubkey === addr || p.UserPubkey === addr);
      if (pool) {
        sections.push(
          await formatPoolContext({
            pubkey: pool.Pubkey,
            displayName: pool.Name,
            pool,
          })
        );
      } else {
        sections.push(
          `- Address \`${addr}\` — not matched to a known creator pool in the live index (may be a wallet or other account).`
        );
      }
    }
  }

  const registryHits = searchRegistryByText(text);
  if (registryHits.size > 0) {
    const entries = (await resolvePoolEntries(registryHits)).slice(0, 4);
    for (const entry of entries) {
      sections.push(await formatPoolContext(entry));
    }
  } else {
    const poolMatches = await searchPoolsByName(text);
    for (const pool of poolMatches.slice(0, 3)) {
      sections.push(
        await formatPoolContext({
          pubkey: pool.Pubkey,
          displayName: pool.Name,
          pool,
        })
      );
    }
  }

  if (wantsProtocolOverview(text) || sections.length <= 2) {
    try {
      const summary = await getProtocolSummary();
      sections.push(
        [
          '### Live network snapshot (Hub API)',
          `- Indexed creator pools: **${summary.poolCount}**`,
          `- Combined ACS staked (indexed pools): **${summary.totalStakedAcs.toLocaleString()}**`,
          '- Top pools by total stake:',
          ...summary.topPools.map(
            (p) =>
              `  ${p.rank}. **${p.name}** — ${p.totalStakedAcs.toLocaleString()} ACS, min ${p.minStakeAcs.toLocaleString()} ACS, category: ${p.category || '—'}, pool: \`${p.pubkey}\``
          ),
        ].join('\n')
      );
    } catch (e) {
      sections.push(`(Could not load protocol summary: ${e.message})`);
    }
  }

  if (sections.length <= 1) return '';

  return [
    sections.join('\n\n'),
    '',
    'Use the live data above when answering. Cite pool addresses and stats from this context. If data is missing, say what you know and suggest checking the Hub link.',
  ].join('\n');
}
