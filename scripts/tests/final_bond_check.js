import { Connection, PublicKey } from '@solana/web3.js';

async function finalBondCheck() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk');

  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });

    console.log(`Found ${bonds.length} bonds.`);
    bonds.forEach((b, i) => {
        const flag = b.account.data[89];
        console.log(`Bond ${i} (${b.pubkey.toBase58()}) Flag89: ${flag}`);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

finalBondCheck();
