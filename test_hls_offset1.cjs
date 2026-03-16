const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAM = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const WALLET = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');

async function test() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  console.log(`Checking ${WALLET.toBase58()} at Offset 1...`);
  try {
    const res = await connection.getProgramAccounts(PROGRAM, {
      filters: [{ memcmp: { offset: 1, bytes: WALLET.toBase58() } }]
    });
    console.log(`Found ${res.length} accounts.`);
    if (res.length > 0) {
      res.forEach((a, i) => {
        const data = a.account.data;
        console.log(`  Acc ${i}: size ${data.length}`);
        if (data.length >= 33 + 8) {
           const amt = data.readBigUInt64LE(33);
           console.log(`    Amt@33: ${Number(amt)/1000000} ACS`);
        }
      });
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

test();
