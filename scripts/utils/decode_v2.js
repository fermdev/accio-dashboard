import { Connection, PublicKey } from '@solana/web3.js';

async function searchUserV2Final() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk');

  console.log('Searching for Tag 11 accounts (ALL) for user:', user.toBase58());
  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });

    console.log(`Found ${bonds.length} Tag 11 accounts.`);
    bonds.forEach((b, i) => {
        console.log(`\nBond #${i}: ${b.pubkey.toBase58()}`);
        console.log('HEX:', b.account.data.toString('hex'));
        
        // Let's decode some potential fields
        // Offset 33: amount (8 bytes)?
        const amount = b.account.data.readBigUInt64LE(33);
        const pool = new PublicKey(b.account.data.slice(41, 73)).toBase58();
        console.log('Amount:', amount.toString());
        console.log('Pool:', pool);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

searchUserV2Final();
