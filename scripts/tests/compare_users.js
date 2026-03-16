import { Connection, PublicKey } from '@solana/web3.js';

async function compareUserBonds() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  
  const user1 = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
  const user2 = new PublicKey('9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk');

  async function getBonds(user) {
    return await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });
  }

  try {
    const bonds1 = await getBonds(user1);
    const bonds2 = await getBonds(user2);

    console.log(`User 1 (HLSx...) has ${bonds1.length} bonds.`);
    console.log(`User 2 (9tcp...) has ${bonds2.length} bonds.`);

    function logBond(b, label) {
        const data = b.account.data;
        const amount = data.readBigUInt64LE(33);
        const pool = new PublicKey(data.slice(41, 73)).toBase58();
        const flag = data[89]; // Last byte
        const extra = data.slice(81, 89).toString('hex');
        console.log(`\n[${label}] ${b.pubkey.toBase58()}`);
        console.log(`Amount: ${amount.toString()}`);
        console.log(`Pool:   ${pool}`);
        console.log(`Flag89: ${flag}`);
        console.log(`Extra81-89: ${extra}`);
    }

    bonds1.forEach((b, i) => logBond(b, `U1-#${i}`));
    bonds2.forEach((b, i) => logBond(b, `U2-#${i}`));

  } catch (err) {
    console.log('Error:', err.message);
  }
}

compareUserBonds();
