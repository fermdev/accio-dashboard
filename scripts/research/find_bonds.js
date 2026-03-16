import { Connection, PublicKey } from '@solana/web3.js';

async function findBondV2Accounts() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');

  console.log('Searching for BondV2 accounts for user...');
  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 0, bytes: 'C' } }, // Tag 11 is 0x0B. Base58 for [0x0B] is 'C'? Wait. 
        // Let's use dataSize filter if we know it. 
        // Tag 11 accounts are usually around 100-200 bytes.
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });

    console.log(`Found ${bonds.length} potential bonds.`);
    bonds.forEach((b, i) => {
        console.log(`Bond ${i}: ${b.pubkey.toBase58()}`);
        console.log('Data (hex):', b.account.data.slice(0, 100).toString('hex'));
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

findBondV2Accounts();
