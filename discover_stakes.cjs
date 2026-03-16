const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAMS = [
  '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup', // Main
  'A77897zPofUf3nHYkK8T2KxGzB657Fm119oP3i9rMtt'  // Transferable (NFTs)
];

const WALLET = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');

async function findStakes() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  
  console.log(`\n--- Searching for ${WALLET.toBase58()} ---`);
  
  for (const p of PROGRAMS) {
    const progPk = new PublicKey(p);
    // Check multiple plausible offsets:
    // 1: Legacy Staker
    // 8: Anchor Staker/Owner
    // 33: Legacy Staker in some layouts
    // 40: Anchor Staker in some layouts
    for (const o of [1, 8, 33, 40]) {
      try {
        const accounts = await connection.getProgramAccounts(progPk, {
          filters: [{ memcmp: { offset: o, bytes: WALLET.toBase58() } }]
        });
        if (accounts.length > 0) {
          console.log(`Prog ${p} Offset ${o}: Found ${accounts.length} accounts`);
          let subtotal = 0n;
          accounts.forEach(a => {
            const data = a.account.data;
            if (data.length >= 73) {
                // If it's a stake account, amount is usually at 33 (Legacy) or 72 (Anchor)
                const amt33 = data.readBigUInt64LE(33);
                const amt72 = data.length >= 80 ? data.readBigUInt64LE(72) : 0n;
                // Heuristic: pick the non-zero one that's smaller than a billion (reasonable ACS stake)
                if (amt33 > 0n && amt33 < 1000000000000000n) subtotal += amt33;
                else if (amt72 > 0n && amt72 < 1000000000000000n) subtotal += amt72;
            }
          });
          console.log(`  Subtotal: ${Number(subtotal)/1000000} ACS`);
        }
      } catch (e) {
        // console.log(`  Prog ${p} Offset ${o} Error: ${e.message}`);
      }
    }
  }
}

findStakes();
