const { Connection, PublicKey } = require('@solana/web3.js');

async function exhaustiveScan(walletAddr) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const wallet = new PublicKey(walletAddr);

  console.log(`--- Exhaustive Scan for ${walletAddr} ---`);
  
  // We can't use memcmp for every offset in one call, 
  // but we can search for the wallet string in ALL program accounts of a certain size.
  // Access Protocol has common sizes: 89, 90, 245, etc.
  
  const sizes = [89, 90, 245, 107]; // Added 107 which is another common AP size
  const walletBytes = Buffer.from(wallet.toBytes());

  for (const size of sizes) {
    console.log(`Checking size ${size}...`);
    try {
      const accounts = await connection.getProgramAccounts(programId, {
        dataSlice: { offset: 0, length: size },
        filters: [{ dataSize: size }]
      });
      
      console.log(`  Found ${accounts.length} accounts of size ${size}. Searching for wallet...`);
      const matches = accounts.filter(a => a.account.data.indexOf(walletBytes) !== -1);
      
      if (matches.length > 0) {
        matches.forEach((m, i) => {
          const offset = m.account.data.indexOf(walletBytes);
          console.log(`  MATCH FOUND: Size ${size}, Offset ${offset}, Pubkey ${m.pubkey.toBase58()}`);
        });
      }
    } catch (e) {
      console.log(`  Error for size ${size}: ${e.message}`);
    }
  }
}

exhaustiveScan('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
