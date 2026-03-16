import { Connection, PublicKey } from '@solana/web3.js';

async function listTags() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

  console.log('Fetching all program accounts (this might take a while)...');
  try {
    const accounts = await connection.getProgramAccounts(programId, {
        dataSlice: { offset: 0, length: 1 }
    });

    const tagCounts = {};
    accounts.forEach(({ account }) => {
        const tag = account.data[0];
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    console.log('Tag Counts:');
    Object.entries(tagCounts).forEach(([tag, count]) => {
        console.log(`Tag ${tag}: ${count} accounts`);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

listTags();
