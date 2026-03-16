import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

async function listGalangBonds() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const pool = new PublicKey('o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  
  console.log(`Checking BondV2 accounts for pool: ${pool.toBase58()}`);
  
  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 0, bytes: bs58.encode([11]) } },
        { memcmp: { offset: 41, bytes: pool.toBase58() } }
      ]
    });
    
    console.log(`Found ${bonds.length} BondV2Accounts for this pool.`);
    if (bonds.length > 0) {
        console.log('Sample Owners (first 10):');
        bonds.slice(0, 10).forEach((acc, i) => {
            const owner = new PublicKey(acc.account.data.slice(1, 33)).toBase58();
            const amount = acc.account.data.readBigUInt64LE(33);
            console.log(`${i}: ${owner} - Amount: ${amount.toString()}`);
        });
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

listGalangBonds();
