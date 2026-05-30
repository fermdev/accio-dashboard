import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const HUB_API = 'https://go-api.accessprotocol.co';
const HUB_HEADERS = {
  Origin: 'https://hub.accessprotocol.co',
  Referer: 'https://hub.accessprotocol.co/',
  Accept: 'application/json',
};

const ACCESS_PROGRAM_ID = '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup';
const POOLS_CACHE_MS = 15 * 60 * 1000;

let poolsCache = null;
let poolsCacheTime = 0;
let registryCache = null;

function loadRegistry() {
  if (!registryCache) {
    const path = join(__dirname, '../../src/data/creator_registry.json');
    registryCache = JSON.parse(readFileSync(path, 'utf8'));
  }
  return registryCache;
}

function toAcs(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n / 1_000_000);
}

function isPoolPubkey(key) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(key);
}

async function hubFetch(path) {
  const res = await fetch(`${HUB_API}${path}`, { headers: HUB_HEADERS });
  if (!res.ok) throw new Error(`Access API ${path} → ${res.status}`);
  return res.json();
}

export async function fetchAllPools() {
  const now = Date.now();
  if (poolsCache && now - poolsCacheTime < POOLS_CACHE_MS) {
    return poolsCache;
  }

  const data = await hubFetch('/pools?order=supporters&per_page=500');
  const list = Array.isArray(data) ? data : Object.values(data).filter((p) => p?.Pubkey);
  poolsCache = list;
  poolsCacheTime = now;
  return list;
}

export async function fetchPoolSupporters(poolPubkey) {
  return hubFetch(`/supporters/${poolPubkey}/locked?per_page=1`);
}

export function searchRegistryByText(text) {
  const registry = loadRegistry();
  const lower = text.toLowerCase();
  const tokens = lower
    .replace(/[^a-z0-9\s-]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3);

  const hits = new Map();

  for (const [key, name] of Object.entries(registry)) {
    const nameLower = String(name).toLowerCase();
    const keyLower = key.toLowerCase();

    const nameMatch =
      lower.includes(nameLower) ||
      nameLower.includes(lower.trim()) ||
      tokens.every((t) => nameLower.includes(t) || keyLower.includes(t));

    if (nameMatch) {
      hits.set(key, name);
    }
  }

  return hits;
}

export async function resolvePoolEntries(registryHits) {
  const pools = await fetchAllPools();
  const resolved = [];

  for (const [key, displayName] of registryHits) {
    if (isPoolPubkey(key)) {
      const pool = pools.find((p) => p.Pubkey === key);
      resolved.push({ pubkey: key, displayName, pool });
      continue;
    }

    const slug = key.toLowerCase();
    const pool = pools.find(
      (p) =>
        p.Slug?.toLowerCase() === slug ||
        p.Name?.toLowerCase() === slug.replace(/-/g, ' ')
    );
    if (pool) {
      resolved.push({ pubkey: pool.Pubkey, displayName, pool });
    } else {
      resolved.push({ pubkey: null, displayName, pool: null, slug: key });
    }
  }

  const seen = new Set();
  return resolved.filter((r) => {
    const id = r.pubkey || r.slug || r.displayName;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export async function searchPoolsByName(text) {
  const pools = await fetchAllPools();
  const lower = text.toLowerCase();
  const tokens = lower.split(/\s+/).filter((t) => t.length >= 2);

  return pools
    .filter((p) => {
      const name = (p.Name || '').toLowerCase();
      const slug = (p.Slug || '').toLowerCase();
      return (
        tokens.every((t) => name.includes(t) || slug.includes(t)) ||
        name.includes(lower.trim())
      );
    })
    .slice(0, 5);
}

export async function getProtocolSummary() {
  const pools = await fetchAllPools();
  let totalStakedRaw = 0;
  let totalSupporters = 0;

  for (const p of pools) {
    totalStakedRaw += Number(p.TotalStaked || 0);
    totalSupporters += Number(p.supporters_count || 0);
  }

  const sorted = [...pools].sort(
    (a, b) => Number(b.TotalStaked || 0) - Number(a.TotalStaked || 0)
  );

  return {
    poolCount: pools.length,
    totalStakedAcs: toAcs(totalStakedRaw),
    topPools: sorted.slice(0, 8).map((p, i) => ({
      rank: i + 1,
      name: p.Name,
      pubkey: p.Pubkey,
      slug: p.Slug,
      totalStakedAcs: toAcs(p.TotalStaked),
      minStakeAcs: toAcs(p.Minimum),
      category: p.CategoryName,
      supporters: p.supporters_count,
    })),
  };
}

export async function formatPoolContext(entry) {
  const { pubkey, displayName, pool } = entry;
  if (!pubkey) {
    return `- **${displayName}** (slug: ${entry.slug || 'unknown'}) — pool not found in live API index.`;
  }

  let supportersCount = pool?.supporters_count;
  let totalStakedAcs = toAcs(pool?.TotalStaked);

  if (supportersCount === undefined) {
    try {
      const sup = await fetchPoolSupporters(pubkey);
      supportersCount = sup.supporters_count ?? sup.total;
      if (!pool?.TotalStaked && sup.supporters?.length) {
        const sum = sup.supporters.reduce((a, s) => a + Number(s.amount || 0), 0);
        totalStakedAcs = toAcs(sum);
      }
    } catch {
      /* use pool totals only */
    }
  }

  const live = pool || (await fetchAllPools()).find((p) => p.Pubkey === pubkey);
  const name = live?.Name || displayName;
  const minStake = toAcs(live?.Minimum);
  const category = live?.CategoryName || '—';
  const slug = live?.Slug || '—';
  const hubUrl = `https://hub.accessprotocol.co/creators/${pubkey}`;

  return [
    `### Creator: ${name}`,
    `- Display / registry name: ${displayName}`,
    `- Pool address: \`${pubkey}\``,
    `- Slug: ${slug}`,
    `- Category: ${category}`,
    `- Total ACS staked: **${totalStakedAcs.toLocaleString()}**`,
    `- Supporters (stakers): **${supportersCount ?? '—'}**`,
    `- Minimum stake: **${minStake.toLocaleString()} ACS**`,
    `- Creator wallet: ${live?.UserPubkey || '—'}`,
    `- Hub: ${hubUrl}`,
    live?.Description
      ? `- About: ${String(live.Description).slice(0, 280)}${live.Description.length > 280 ? '…' : ''}`
      : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export const ACCESS_PROTOCOL_DOCS = {
  guide: 'https://docs.accessprotocol.co/guide',
  api: 'https://docs.accessprotocol.co/api',
  hub: 'https://hub.accessprotocol.co',
  programId: ACCESS_PROGRAM_ID,
  hubApi: HUB_API,
};
