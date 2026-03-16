import { Connection, PublicKey } from '@solana/web3.js';

async function inspectMoreTag11() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

  try {
    const accounts = await connection.getProgramAccounts(programId, {
        filters: [
            { dataSize: 90 }
        ],
        limit: 20
    });

    console.log(`Found ${accounts.length} potential Tag 11 accounts.`);
    accounts.forEach((a, i) => {
        const data = a.account.data;
        if (data[0] === 11) {
            console.log(`\nAccount #${i}: ${a.pubkey.toBase58()}`);
            console.log('Data Hex:', data.toString('hex'));
            // Check for potential addresses (32 bytes)
            // Offset 1 to 33, 33 to 65, etc.
            const p1 = new PublicKey(data.slice(1, 33)).toBase58();
            const p2 = new PublicKey(data.slice(33, 65)).toBase58();
            const p3 = new PublicKey(data.slice(41, 73)).toBase58(); // Standard pool offset in Tag 3
            console.log('Pubkey at 1:', p1);
            console.log('Pubkey at 33:', p2);
            console.log('Pubkey at 41:', p3);
        }
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectMoreTag11();
