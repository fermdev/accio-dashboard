import { Connection, PublicKey } from '@solana/web3.js';

async function compareBonds() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk');

  console.log('Fetching BondV2 accounts for deep comparison...');
  try {
    const bonds = await connection.getProgramAccounts(programId, {
      filters: [
        { dataSize: 90 },
        { memcmp: { offset: 1, bytes: user.toBase58() } }
      ]
    });

    console.log(`User has ${bonds.length} bonds.`);
    bonds.forEach((b, i) => {
        const data = b.account.data;
        console.log(`\n--- Bond #${i} (${b.pubkey.toBase58()}) ---`);
        console.log('Hex:', data.toString('hex'));
        
        // Decoded fields
        const owner = new PublicKey(data.slice(1, 33)).toBase58();
        const amount = data.readBigUInt64LE(33);
        const pool = new PublicKey(data.slice(41, 73)).toBase58();
        const claim = data.readBigUInt64LE(73);
        const assetId = data.slice(81, 89).toString('hex'); // Potential ID
        const flag = data[89]; // Is this the Forever vs Redeemable flag?
        
        console.log('Owner:', owner);
        console.log('Amount:', amount.toString());
        console.log('Pool:', pool);
        console.log('LastClaim:', claim.toString());
        console.log('AssetId (LE):', assetId);
        console.log('Flag (byte 89):', flag);
    });

    // Let's also fetch 5 random bonds to see if flag 89 varies
    console.log('\nFetching 5 random BondV2 accounts for control...');
    const randoms = await connection.getProgramAccounts(programId, {
        filters: [{ dataSize: 90 }],
        limit: 5
    });
    randoms.forEach((b, i) => {
        console.log(`Random #${i} flag (byte 89): ${b.account.data[89]}`);
        console.log(`Hex: ${b.account.data.toString('hex')}`);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

compareBonds();
