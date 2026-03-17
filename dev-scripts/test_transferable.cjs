const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAM = new PublicKey('A77897zPofUf3nHYkK8T2KxGzB657Fm119oP3i9rMtt');
const WALLET = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
const WALLET2 = new PublicKey('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');

async function testTransferable(wallet) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  console.log(`\n--- Searching Transferable Program for ${wallet.toBase58()} ---`);
  
  const walletBytes = Buffer.from(wallet.toBytes());
  
  // Try common offsets: 8 (Anchor owner), 1 (Legacy owner), 33 (Legacy staker), 40 (Anchor staker)
  for (const offset of [1, 8, 32, 40]) {
    try {
      const accounts = await connection.getProgramAccounts(PROGRAM, {
        filters: [{ memcmp: { offset, bytes: wallet.toBase58() } }]
      });
      console.log(`  Offset ${offset}: Found ${accounts.length} accounts`);
      if (accounts.length > 0) {
        accounts.forEach(a => {
           console.log(`    Account ${a.pubkey.toBase58()} - Size ${a.account.data.length}`);
        });
      }
    } catch (e) {
      console.log(`  Offset ${offset} Error: ${e.message}`);
    }
  }
}

(async () => {
  await testTransferable(WALLET);
  await testTransferable(WALLET2);
})();
