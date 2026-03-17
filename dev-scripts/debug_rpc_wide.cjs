const { Connection, PublicKey } = require('@solana/web3.js');

const WALLET = new PublicKey('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
const ACCESS_PROGRAM = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const RPC = 'https://api.mainnet-beta.solana.com';

async function debugWide() {
  const connection = new Connection(RPC);
  console.log(`Searching for ANY accounts owned by ${ACCESS_PROGRAM.toBase58()} with user ${WALLET.toBase58()} at various offsets...`);
  
  try {
    // Try memcmp at offset 1 (common for stake accounts)
    const res1 = await connection.getProgramAccounts(ACCESS_PROGRAM, {
      filters: [
        { memcmp: { offset: 1, bytes: WALLET.toBase58() } }
      ]
    });
    console.log(`Found ${res1.length} accounts at offset 1.`);
    res1.forEach((a, i) => console.log(`  [${i}] size: ${a.account.data.length}`));

    // Try memcmp at offset 0 (just in case)
    const res0 = await connection.getProgramAccounts(ACCESS_PROGRAM, {
      filters: [
        { memcmp: { offset: 0, bytes: WALLET.toBase58() } }
      ]
    });
    console.log(`Found ${res0.length} accounts at offset 0.`);

  } catch (e) {
    console.error('Error:', e.message);
  }
}

debugWide();
