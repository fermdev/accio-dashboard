import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

async function findBondForMint() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const mint = new PublicKey('FbQ9TbB53J9LFSTXCjx5X7uu1ocewqS3jagYRph3LHbh');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  
  console.log(`Searching for Bond accounts for mint: ${mint.toBase58()}`);
  
  try {
    // Search for BondV2 (Tag 11) where owner (offset 1) is mint
    const bondV2s = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 0, bytes: bs58.encode([11]) } },
        { memcmp: { offset: 1, bytes: mint.toBase58() } }
      ]
    });
    console.log(`Found ${bondV2s.length} BondV2Accounts.`);
    if (bondV2s.length > 0) {
      console.log('BondV2 Data (first 64 bytes):', bondV2s[0].account.data.slice(0, 64).toString('hex'));
      const amount = bondV2s[0].account.data.readBigUInt64LE(33);
      console.log('ACS Amount:', amount.toString());
    }

    // Search for regular Bond (Tag 5) where owner (offset 1) is mint
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 0, bytes: bs58.encode([5]) } },
        { memcmp: { offset: 1, bytes: mint.toBase58() } }
      ]
    });
    console.log(`Found ${bonds.length} BondAccounts.`);
    if (bonds.length > 0) {
      console.log('Bond Data (first 64 bytes):', bonds[0].account.data.slice(0, 64).toString('hex'));
      const amount = bonds[0].account.data.readBigUInt64LE(41);
      console.log('ACS Amount:', amount.toString());
    }

  } catch (err) {
    console.log('Error:', err.message);
  }
}

findBondForMint();
