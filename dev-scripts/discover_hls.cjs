const { Connection, PublicKey } = require('@solana/web3.js');

const WALLET = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
const PROGRAMS = [
  '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup', // Main
  'A77897zPofUf3nHYkK8T2KxGzB657Fm119oP3i9rMtt'  // Transferable (NFTs)
];

async function discover() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const walletBytes = Buffer.from(WALLET.toBytes());

  console.log(`Discovering accounts for ${WALLET.toBase58()}...`);

  for (const progId of PROGRAMS) {
    const program = new PublicKey(progId);
    console.log(`\nProgram: ${progId}`);
    
    try {
      // Get all accounts of this program to find where the wallet is mentioned
      // Note: This is heavy, but we do it once for debugging
      const accounts = await connection.getProgramAccounts(program, {
        encoding: 'base64'
      });
      
      console.log(`  Found ${accounts.length} accounts. Matching...`);
      const matches = accounts.filter(a => {
        const data = Buffer.from(a.account.data[0], 'base64');
        return data.indexOf(walletBytes) !== -1;
      });
      
      console.log(`  Matches: ${matches.length}`);
      matches.forEach((m, i) => {
        const data = Buffer.from(m.account.data[0], 'base64');
        const offset = data.indexOf(walletBytes);
        console.log(`    Match ${i}: offset ${offset}, size ${data.length}, pubkey ${m.pubkey.toBase58()}`);
        if (data.length >= 73) {
            const amt33 = data.readBigUInt64LE(33);
            const amt72 = data.readBigUInt64LE(72);
            console.log(`      Amt@33: ${Number(amt33)/1000000}, Amt@72: ${Number(amt72)/1000000}`);
        }
      });
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
}

discover();
