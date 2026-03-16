import { Connection, PublicKey } from '@solana/web3.js';

async function searchUserV2Final() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk');

  console.log('Searching for Tag 11 accounts (90 bytes) for user:', user.toBase58());
  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });

    console.log(`Found ${bonds.length} Tag 11 accounts.`);
    bonds.forEach((b, i) => {
        console.log(`Bond ${i}: ${b.pubkey.toBase58()}`);
        console.log('Data Hex:', b.account.data.toString('hex'));
    });

    // Also try offset 33 (just in case owner is stored elsewhere)
    const bonds2 = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 33, bytes: user.toBase58() } }
      ]
    });
    if (bonds2.length > 0) {
        console.log(`Found ${bonds2.length} Tag 11 accounts at offset 33.`);
    }

  } catch (err) {
    console.log('Error:', err.message);
  }
}

searchUserV2Final();
