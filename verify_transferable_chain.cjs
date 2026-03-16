const { Connection, PublicKey } = require('@solana/web3.js');

async function test() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const prog = 'A77897zPofUf3nHYkK8T2KxGzB657Fm119oP3i9rMtt';
  const user = new PublicKey(wallet);

  console.log('Checking Transferable Subscriptions for:', wallet);
  
  // Offsets to try: 1, 8, 33, 40
  const offsets = [1, 8, 40];
  for (const offset of offsets) {
    console.log(`Checking offset ${offset}...`);
    try {
      const accs = await connection.getProgramAccounts(new PublicKey(prog), {
        filters: [{ memcmp: { offset, bytes: user.toBase58() } }]
      });
      console.log(`Found ${accs.length} accounts at offset ${offset}`);
      if (accs.length > 0) {
          accs.forEach(a => {
              const d = a.account.data;
              console.log(` - Acc: ${a.pubkey.toBase58()}, Len: ${d.length}`);
              // Try to read BigUInt64 at 33 or 40
              if (d.length >= 41) {
                  const amt = d.readBigUInt64LE(33);
                  console.log(`   Amt@33: ${Number(amt/1000000n)} ACS`);
              }
              if (d.length >= 48) {
                  const amt = d.readBigUInt64LE(40);
                  console.log(`   Amt@40: ${Number(amt/1000000n)} ACS`);
              }
          });
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

test();
