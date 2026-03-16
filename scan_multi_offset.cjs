const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const RPC = 'https://api.mainnet-beta.solana.com';

async function scanMultiOffset(walletAddr) {
  const connection = new Connection(RPC);
  const wallet = new PublicKey(walletAddr);
  
  // Possible offsets for staker pubkey:
  // 1: Legacy StakeAccount
  // 8: Anchor-style StakeAccount
  // 32, 40: Other potential variations
  const offsets = [1, 8, 32, 40];
  
  console.log(`\n--- Scanning Wallet: ${walletAddr} ---`);
  
  for (const offset of offsets) {
    try {
      const res = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [{ memcmp: { offset, bytes: wallet.toBase58() } }]
      });
      console.log(`Offset ${offset}: Found ${res.length} accounts`);
      
      if (res.length > 0) {
        res.forEach((a, i) => {
          const data = a.account.data;
          console.log(`  Account ${i}: Size ${data.length}`);
          // Try to find amount:
          // In Legacy (offset 1): amount is at 33
          // In New (offset 8): amount is at 72?
          if (data.length >= 80) {
             const amt33 = data.readBigUInt64LE(33);
             const amt72 = data.readBigUInt64LE(72);
             console.log(`    Amt@33: ${Number(amt33)/1000000}, Amt@72: ${Number(amt72)/1000000}`);
          }
        });
      }
    } catch (e) {
      console.log(`Offset ${offset} Error: ${e.message}`);
    }
  }
}

(async () => {
  await scanMultiOffset('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
  await scanMultiOffset('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
})();
