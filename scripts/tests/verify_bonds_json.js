import { Connection, PublicKey } from '@solana/web3.js';
import fs from 'fs';

async function verifyBondsJson() {
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

    const results = bonds.map((b, i) => ({
        index: i,
        pubkey: b.pubkey.toBase58(),
        flag: b.account.data[89],
        amount: b.account.data.readBigUInt64LE(33).toString(),
        pool: new PublicKey(b.account.data.slice(41, 73)).toBase58()
    }));

    fs.writeFileSync('bond_results.json', JSON.stringify(results, null, 2));
    console.log('Results saved to bond_results.json');

  } catch (err) {
    console.log('ERROR:', err.message);
  }
}

verifyBondsJson();
