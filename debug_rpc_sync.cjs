const { Connection, PublicKey } = require('@solana/web3.js');

const WALLET = new PublicKey('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
const ACCESS_PROGRAM = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const RPC = 'https://api.mainnet-beta.solana.com';

async function debug() {
  const connection = new Connection(RPC);
  console.log(`Checking accounts for ${WALLET.toBase58()} on program ${ACCESS_PROGRAM.toBase58()}...`);
  
  try {
    const accounts = await connection.getProgramAccounts(ACCESS_PROGRAM, {
      filters: [
        { dataSize: 89 },
        { memcmp: { offset: 1, bytes: WALLET.toBase58() } }
      ]
    });
    
    console.log(`Found ${accounts.length} accounts.`);
    
    accounts.slice(0, 3).forEach((acc, i) => {
      console.log(`Account ${i} data (hex):`, acc.account.data.toString('hex'));
      const amount = acc.account.data.readBigUInt64LE(33);
      const pool = new PublicKey(acc.account.data.slice(41, 73));
      console.log(`  Amount: ${amount}`);
      console.log(`  Pool: ${pool.toBase58()}`);
    });

  } catch (e) {
    console.error('Error fetching program accounts:', e.message);
  }
}

debug();
