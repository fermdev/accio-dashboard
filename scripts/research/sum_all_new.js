import { Connection, PublicKey } from '@solana/web3.js';

async function sumBonds() {
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

    let totalAmount = BigInt(0);
    console.log(`Analyzing ${bonds.length} bonds for ${user.toBase58()}...`);

    bonds.forEach((b, i) => {
        const data = b.account.data;
        const amount = data.readBigUInt64LE(33);
        const pool = new PublicKey(data.slice(41, 73)).toBase58();
        totalAmount += amount;
        console.log(`Bond ${i}: ${amount.toString()} ACS (scaled) | Pool: ${pool}`);
    });

    console.log(`\nGrand Total (Scaled): ${(Number(totalAmount) / 1000000).toLocaleString()} ACS`);

    // Check if user also has v1 stakes (Tag 3)
    const stakes = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 151 },
        { memcmp: { offset: 41, bytes: user.toBase58() } }
      ]
    });
    console.log(`User has ${stakes.length} legacy (Tag 3) stakes.`);
    let stakeTotal = BigInt(0);
    stakes.forEach(s => {
        const amt = s.account.data.readBigUInt64LE(73);
        stakeTotal += amt;
    });
    console.log(`Legacy Total (Scaled): ${(Number(stakeTotal) / 1000000).toLocaleString()} ACS`);
    
    console.log(`\nCombined Total: ${(Number(totalAmount + stakeTotal) / 1000000).toLocaleString()} ACS`);

  } catch (err) {
    console.log('Error:', err.message);
  }
}

sumBonds();
