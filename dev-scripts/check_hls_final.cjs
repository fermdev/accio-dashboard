const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const WALLET = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
const MAIN_PROG = '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup';
const TRANSFER_PROG = 'A77897zPofUf3nHYkK8T2KxGzB657Fm119oP3i9rMtt';

const HEADERS = { 'Origin': 'https://hub.accessprotocol.co' };

async function check() {
  console.log('=== Checking wallet:', WALLET, '===\n');

  // 1. Check API endpoints
  const apiEndpoints = [
    `https://go-api.accessprotocol.co/supporters/locked?user_pubkey=${WALLET}`,
    `https://go-api.accessprotocol.co/supporters/forever?user_pubkey=${WALLET}`,
    `https://go-api.accessprotocol.co/supporters/redeemable?user_pubkey=${WALLET}`,
  ];

  console.log('--- API Checks ---');
  for (const url of apiEndpoints) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      const text = await res.text();
      console.log(`${url.split('?')[0].split('/').pop()} -> Status ${res.status}: ${text.slice(0, 200)}`);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }

  // 2. Check RPC at various offsets for BOTH programs
  console.log('\n--- RPC Checks ---');
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const user = new PublicKey(WALLET);

  for (const [name, prog] of [['Main', MAIN_PROG], ['Transferable', TRANSFER_PROG]]) {
    for (const offset of [1, 8, 33, 40]) {
      try {
        const acc = await connection.getProgramAccounts(new PublicKey(prog), {
          filters: [{ memcmp: { offset, bytes: user.toBase58() } }]
        });
        if (acc.length > 0) {
          console.log(`[FOUND] ${name} @ offset ${offset}: ${acc.length} accounts`);
          for (const a of acc) {
            const d = a.account.data;
            const sizes = [33, 40, 41, 72, 80];
            for (const s of sizes) {
              if (d.length >= s + 8) {
                const v = Number(d.readBigUInt64LE(s)) / 1e6;
                if (v > 0 && v < 1e9) console.log(`  amt@${s} = ${v.toLocaleString()} ACS`);
              }
            }
          }
        }
      } catch (e) { /* skip */ }
    }
  }

  // 3. Check token accounts (NFT-based subscriptions)
  console.log('\n--- Token Accounts (NFTs) ---');
  try {
    const tokens = await connection.getParsedTokenAccountsByOwner(user, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });
    if (tokens.value.length === 0) {
      console.log('No token accounts found.');
    }
    for (const t of tokens.value) {
      const info = t.account.data.parsed.info;
      const amt = info.tokenAmount.uiAmount;
      console.log(`Mint: ${info.mint}, Amount: ${amt}`);
    }
  } catch (e) {
    console.log('Token check error:', e.message);
  }
}

check();
