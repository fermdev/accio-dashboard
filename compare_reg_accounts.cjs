const { Connection, PublicKey } = require('@solana/web3.js');

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

async function compareAccounts(user1, user2) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  
  console.log(`Comparing Registration Accounts:`);
  console.log(`User 1 (Target): ${user1}`);
  console.log(`User 2 (Ref): ${user2}`);
  
  try {
    const accs1 = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
        filters: [{ dataSize: 89 }, { memcmp: { offset: 1, bytes: new PublicKey(user1).toBase58() } }]
    });
    const accs2 = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
        filters: [{ dataSize: 89 }, { memcmp: { offset: 1, bytes: new PublicKey(user2).toBase58() } }]
    });

    console.log(`User 1 has ${accs1.length} accounts`);
    console.log(`User 2 has ${accs2.length} accounts`);
    
    accs1.slice(0, 3).forEach((acc, i) => {
        console.log(`\nUser 1 Acc ${i} Hex:`);
        console.log(acc.account.data.toString('hex'));
    });
    
    accs2.slice(0, 3).forEach((acc, i) => {
        console.log(`\nUser 2 Acc ${i} Hex:`);
        console.log(acc.account.data.toString('hex'));
    });

  } catch (e) {
    console.log('Error:', e.message);
  }
}

// CvaGTk (confirmed Forever in some pools) vs a random 4NUFY
compareAccounts('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn', '4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
