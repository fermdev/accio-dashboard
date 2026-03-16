import { Connection, PublicKey } from '@solana/web3.js';

async function listV1Accounts() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  
  try {
    console.log(`Listing all accounts for program: ${programId.toBase58()}`);
    const accounts = await connection.getProgramAccounts(programId, {
      dataSlice: { offset: 0, length: 1 } // Just get the tag byte
    });
    
    console.log(`Found ${accounts.length} total accounts.`);
    
    const tagCounts = {};
    accounts.forEach(acc => {
      const tag = acc.account.data[0];
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    console.log('Tag Distribution:', tagCounts);
    // Tags: 3=StakeAccount, 5=BondAccount, 11=BondV2Account?
  } catch (err) {
    console.log('Error:', err.message);
  }
}

listV1Accounts();
