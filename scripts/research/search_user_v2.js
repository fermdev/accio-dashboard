import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

async function searchUserBondV2() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');

  console.log('Searching for Tag 11 accounts for user...');
  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });

    console.log(`Found ${bonds.length} Tag 11 accounts.`);
    bonds.forEach((b, i) => {
        console.log(`Bond ${i}: ${b.pubkey.toBase58()}`);
        console.log('Data Hex:', b.account.data.toString('hex'));
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

searchUserBondV2();
