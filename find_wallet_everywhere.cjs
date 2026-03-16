const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const WALLET = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
const walletBytes = Buffer.from(WALLET.toBytes());

async function findWalletEverywhere() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  
  console.log(`Searching for ${WALLET.toBase58()} in ALL accounts of program ${PROGRAM_ID.toBase58()}...`);
  
  // This might take a while and fail if the RPC is strict
  try {
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
        encoding: 'base64'
    });
    
    console.log(`Downloaded ${accounts.length} accounts. Matching...`);
    
    const matches = accounts.filter(a => {
        const data = Buffer.from(a.account.data[0], 'base64');
        return data.indexOf(walletBytes) !== -1;
    });
    
    console.log(`Found ${matches.length} matches.`);
    
    matches.forEach((m, i) => {
        const data = Buffer.from(m.account.data[0], 'base64');
        const offset = data.indexOf(walletBytes);
        console.log(`  Match ${i}: Offset ${offset}, Size ${data.length}`);
        if (data.length >= offset + 32 + 8) {
             // Let's look for amounts around there
             // If offset 1, amount is at 33 (1+32)
             // If offset 8, amount is at 40 (8+32)
             const amtAtEnd = data.readBigUInt64LE(offset + 32);
             console.log(`    Possible amount at offset+32: ${Number(amtAtEnd)/1000000} ACS`);
        }
    });
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
}

findWalletEverywhere();
