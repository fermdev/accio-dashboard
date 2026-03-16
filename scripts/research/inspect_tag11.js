import { Connection, PublicKey } from '@solana/web3.js';

async function inspectTag11() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

  try {
    const accounts = await connection.getProgramAccounts(programId, {
        filters: [
            { memcmp: { offset: 0, bytes: 'D' } } // Tag 11 is 'D' in base58 (assuming 11)
            // Wait, Tag 11 is 0x0B. Base58 for [0x0B] is 'C' or something?
            // Actually, I specify bytes as base58 in filters. 
            // Better to use dataSize if I knew it.
        ],
        dataSlice: { offset: 0, length: 100 }
    });

    // Wait, let's just fetch ALL without filter first but limit to 1
    const all = await connection.getProgramAccounts(programId, {
        limit: 100, // Just in case
    });

    const tag11 = all.find(a => a.account.data[0] === 11);
    if (tag11) {
        console.log('Found Tag 11 Account:', tag11.pubkey.toBase58());
        console.log('Size:', tag11.account.data.length);
        console.log('Data Hex:', tag11.account.data.toString('hex').slice(0, 200));
    } else {
        console.log('Tag 11 not found in first 100 accounts.');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectTag11();
