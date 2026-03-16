import { Connection, PublicKey } from '@solana/web3.js';

async function listAllAccounts() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

  console.log('Fetching all program accounts (this might take a while)...');
  try {
    const start = Date.now();
    const accounts = await connection.getProgramAccounts(programId, {
        dataSlice: { offset: 0, length: 1 } 
    });
    const end = Date.now();
    console.log(`Fetched ${accounts.length} accounts in ${end - start}ms`);

    const tagCounts = {};
    accounts.forEach(({ account }) => {
        const tag = account.data[0];
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    console.log('Tag Counts (first byte):');
    Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).forEach(([tag, count]) => {
        console.log(`Tag ${tag}: ${count} accounts`);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

listAllAccounts();
