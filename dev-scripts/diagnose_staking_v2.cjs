const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAMS = [
  '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup', // Main Access
  'A77897zPofUf3nHYkK8T2KxGzB657Fm119oP3i9rMtt'  // Transferable (NFTs)
];

const WALLET = 'CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn';
const WALLET2 = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

async function diagnose(walletAddr) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const user = new PublicKey(walletAddr);
  
  console.log(`\n=== Diagnosing Wallet: ${walletAddr} ===`);
  
  for (const progId of PROGRAMS) {
    console.log(`\nProgram: ${progId}`);
    const program = new PublicKey(progId);
    
    // Test offsets 1 through 64 (common starting points)
    // We'll try 1, 8, 33, 40 (Legacy/Anchor staker/owner positions)
    const offsets = [1, 8, 32, 33, 40, 41];
    
    for (const offset of offsets) {
      try {
        const accounts = await connection.getProgramAccounts(program, {
          filters: [{ memcmp: { offset, bytes: user.toBase58() } }]
        });
        if (accounts.length > 0) {
          console.log(`  Offset ${offset}: Found ${accounts.length} accounts`);
          accounts.slice(0, 1).forEach(a => {
             const data = a.account.data;
             console.log(`    Size: ${data.length} bytes`);
             // Hex snippet:
             console.log(`    Prefix: ${data.slice(0, 16).toString('hex')}...`);
             if (data.length >= 73) {
                // Potential amount locations
                const amt33 = data.readBigUInt64LE(33);
                const amt41 = data.readBigUInt64LE(41);
                const amt72 = data.readBigUInt64LE(72);
                console.log(`    Plausible Amts: @33: ${Number(amt33)/1000000}, @41: ${Number(amt41)/1000000}, @72: ${Number(amt72)/1000000}`);
             }
          });
        }
      } catch (e) {
        // console.log(`  Offset ${offset} Error: ${e.message}`);
      }
    }
  }
}

(async () => {
  await diagnose(WALLET);
  await diagnose(WALLET2);
})();
