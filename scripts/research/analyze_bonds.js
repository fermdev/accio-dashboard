import { Connection, PublicKey } from '@solana/web3.js';

async function analyzeBonds() {
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

    console.log(`Found ${bonds.length} Tag 11 accounts.`);
    bonds.forEach((b, i) => {
        const data = b.account.data;
        console.log(`\nBond #${i}: ${b.pubkey.toBase58()}`);
        console.log('FULL HEX:', data.toString('hex'));
        
        // Potential format:
        // [0] Tag (1 byte)
        // [1-33] Owner (32 bytes)
        // [33-41] Amount (8 bytes)
        // [41-73] Pool (32 bytes)
        // [73-81] LastClaim (8 bytes)
        // [81-89] ID/Salt/Asset? (8 bytes)
        // [89] ??? (1 byte)
        
        const owner = new PublicKey(data.slice(1, 33)).toBase58();
        const amount = data.readBigUInt64LE(33);
        const pool = new PublicKey(data.slice(41, 73)).toBase58();
        const claim = data.readBigUInt64LE(73);
        const tail = data.slice(81).toString('hex');
        
        console.log('Owner:', owner);
        console.log('Amount:', amount.toString());
        console.log('Pool:', pool);
        console.log('LastClaim:', claim.toString());
        console.log('Tail:', tail);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

analyzeBonds();
