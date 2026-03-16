import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

async function testV2Program() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6VnsQoHQt8hhYQDhSgU1KTxEhbDSCtePRs1Q2m9a8e3E');
  
  try {
    console.log(`Checking program accounts for: ${programId.toBase58()}`);
    const accounts = await connection.getProgramAccounts(programId, {
      dataSlice: { offset: 0, length: 8 },
      filters: [
        { memcmp: { offset: 0, bytes: bs58.encode([11]) } }
      ]
    });
    
    console.log(`Found ${accounts.length} BondV2Accounts.`);
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testV2Program();
