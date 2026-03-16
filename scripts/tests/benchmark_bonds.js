import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

async function benchmarkBondV2Search() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

  console.log('Fetching all BondV2 accounts (Tag 11)...');
  const start = Date.now();
  
  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 0, bytes: bs58.encode([11]) } }
      ]
    });
    
    const end = Date.now();
    console.log(`Fetched ${bonds.length} accounts in ${end - start}ms`);
    
    console.log('Searching for user wallet in data...');
    const userBuffer = new PublicKey(user).toBuffer();
    const hits = bonds.filter(acc => acc.account.data.includes(userBuffer));
    
    console.log(`Found ${hits.length} matches for user.`);
    hits.forEach((h, i) => {
        const data = h.account.data;
        const amount = data.readBigUInt64LE(33);
        const pool = new PublicKey(data.slice(41, 73)).toBase58();
        console.log(`${i}: Pool ${pool} - Amount: ${amount.toString()}`);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

benchmarkBondV2Search();
