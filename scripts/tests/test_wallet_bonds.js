import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

async function findBondsByWallet() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const user = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  
  console.log(`Searching for BondV2 accounts for WALLET: ${user.toBase58()}`);
  
  try {
    // Search for BondV2 (Tag 11) where owner (offset 1) is user wallet
    const bondV2s = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 0, bytes: bs58.encode([11]) } },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });
    console.log(`Found ${bondV2s.length} BondV2Accounts.`);
    let total = 0n;
    bondV2s.forEach((acc, i) => {
        const amount = acc.account.data.readBigUInt64LE(33);
        console.log(`${i}: ${acc.pubkey.toBase58()} - Amount: ${amount.toString()}`);
        total += amount;
    });
    console.log(`Total BondV2: ${Number(total / 1000000n) / 1000} ACS`);

    // Also check for regular Bonds (Tag 5)
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 0, bytes: bs58.encode([5]) } },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });
    console.log(`Found ${bonds.length} BondAccounts.`);
    let totalBonds = 0n;
    bonds.forEach((acc, i) => {
        const amount = acc.account.data.readBigUInt64LE(41);
        console.log(`${i}: ${acc.pubkey.toBase58()} - Amount: ${amount.toString()}`);
        totalBonds += amount;
    });
    console.log(`Total Regular Bonds: ${Number(totalBonds / 1000000n) / 1000} ACS`);

  } catch (err) {
    console.log('Error:', err.message);
  }
}

findBondsByWallet();
