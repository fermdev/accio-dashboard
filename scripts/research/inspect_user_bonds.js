import { Connection, PublicKey } from '@solana/web3.js';

async function inspectUserBonds() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk');

  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });

    console.log(`Found ${bonds.length} bonds for user.`);
    bonds.forEach((b, i) => {
        const data = b.account.data;
        console.log(`\nBond ${i}: ${b.pubkey.toBase58()}`);
        console.log('Last Byte (89):', data[89]);
        console.log('Full Hex:', data.toString('hex'));
        
        // Decoded fields
        const amount = data.readBigUInt64LE(33);
        const pool = new PublicKey(data.slice(41, 73)).toBase58();
        console.log('Amount:', amount.toString());
        console.log('Pool:', pool);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectUserBonds();
