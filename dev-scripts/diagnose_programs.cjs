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
    
    // Test offsets 1 and 8
    for (const offset of [1, 8]) {
      try {
        const accounts = await connection.getProgramAccounts(program, {
          filters: [{ memcmp: { offset, bytes: user.toBase58() } }]
        });
        console.log(`  Offset ${offset}: Found ${accounts.length} accounts`);
        if (accounts.length > 0) {
          accounts.slice(0, 1).forEach(a => {
             console.log(`    Sample Size: ${a.account.data.length} bytes`);
             // Hex dump first 32 bytes after the match
             const data = a.account.data;
             console.log(`    Data snippet: ${data.slice(0, 100).toString('hex')}`);
          });
        }
      } catch (e) {
        console.log(`  Offset ${offset} Error: ${e.message}`);
      }
    }
  }
}

(async () => {
  await diagnose(WALLET);
  await diagnose(WALLET2);
})();
