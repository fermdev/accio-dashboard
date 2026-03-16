const { Connection, PublicKey } = require('@solana/web3.js');

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

async function inspectTrailingBytes(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);
  
  console.log(`Inspecting registration accounts for: ${userAddress}`);
  
  try {
    const accs = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
        filters: [
            { dataSize: 89 },
            { memcmp: { offset: 1, bytes: userPk.toBase58() } }
        ]
    });

    console.log(`Found ${accs.length} accounts`);
    accs.forEach((acc, i) => {
        const data = acc.account.data;
        // Last few bytes: 81-89
        const trailing = data.slice(81, 89).toString('hex');
        const amount = data.readBigUInt64LE(33);
        const pool = new PublicKey(data.slice(41, 73)).toBase58();
        console.log(`- Acc ${i} | Pool: ${pool.slice(0,5)} | Amount: ${amount} | Trailing: ${trailing}`);
    });

  } catch (e) {
    console.log('Error:', e.message);
  }
}

// Inspect the known "Forever" reference
inspectTrailingBytes('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
