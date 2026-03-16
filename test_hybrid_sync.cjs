const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const MAIN_PROGRAM = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const TRANSFERABLE_PROGRAM = new PublicKey('A77897zPofUf3nHYkK8T2KxGzB657Fm119oP3i9rMtt');

async function hybridSync(walletAddr) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const user = new PublicKey(walletAddr);
  let totalStaked = 0;
  let poolCount = 0;
  const foundPools = new Set();

  console.log(`\n--- Hybrid Sync for ${walletAddr} ---`);

  // 1. Direct RPC Scans (Parallel)
  const rpcScans = [
    { p: MAIN_PROGRAM, o: 1 },
    { p: MAIN_PROGRAM, o: 8 },
    { p: TRANSFERABLE_PROGRAM, o: 1 },
    { p: TRANSFERABLE_PROGRAM, o: 8 }
  ];

  const rpcResults = await Promise.all(rpcScans.map(async (s) => {
    try {
      const accounts = await connection.getProgramAccounts(s.p, {
        filters: [{ memcmp: { offset: s.o, bytes: user.toBase58() } }]
      });
      return { offset: s.o, program: s.p.toBase58(), accounts };
    } catch (e) {
      return { offset: s.o, program: s.p.toBase58(), accounts: [] };
    }
  }));

  rpcResults.forEach(r => {
    if (r.accounts.length > 0) {
      console.log(`RPC Found ${r.accounts.length} accounts in ${r.program} at offset ${r.offset}`);
      r.accounts.forEach(a => {
        const data = a.account.data;
        if (data.length >= 73) {
          const amt33 = data.readBigUInt64LE(33);
          const amt72 = data.length >= 80 ? data.readBigUInt64LE(72) : 0n;
          
          let amt = 0n;
          if (amt33 > 0n && amt33 < 1000000000000000n) amt = amt33;
          else if (amt72 > 0n && amt72 < 1000000000000000n) amt = amt72;
          
          if (amt > 0n) {
            totalStaked += Number(amt) / 1000000;
            // Pool address is usually at 41 (Legacy) or 40 (Anchor/Transferable)
            // But for now, we just count the account as a pool participation
            poolCount++;
          }
        }
      });
    }
  });

  // 2. Go-API Fallbacks (Parallel)
  const apis = ['locked', 'forever', 'redeemable'];
  const apiResults = await Promise.all(apis.map(async (type) => {
    try {
      const res = await fetch(`https://go-api.accessprotocol.co/supporters/${type}?user_pubkey=${walletAddr}`, {
        headers: { 'Origin': 'https://hub.accessprotocol.co' }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  }));

  apiResults.forEach((data, i) => {
    if (data && data.total > 0) {
      const type = apis[i];
      console.log(`API Found ${data.total} ACS in ${type} staking`);
      // Avoid double counting if RPC already found it (approximate)
      if (totalStaked < data.total) {
        totalStaked = data.total;
        poolCount = Math.max(poolCount, data.supporters_count || 0);
      }
    }
  });

  console.log(`Final Result: ${totalStaked} ACS, ${poolCount} Pools`);
}

(async () => {
  await hybridSync('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
  await hybridSync('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
})();
