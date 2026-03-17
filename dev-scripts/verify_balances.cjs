const { Connection, PublicKey } = require('@solana/web3.js');

const WALLET = new PublicKey('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
const ACCESS_PROGRAM = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const RPC = 'https://api.mainnet-beta.solana.com';

async function verifyBalances() {
  const connection = new Connection(RPC);
  console.log(`Verifying balances for ${WALLET.toBase58()}...`);
  
  try {
    const res = await connection.getProgramAccounts(ACCESS_PROGRAM, {
      filters: [
        { memcmp: { offset: 1, bytes: WALLET.toBase58() } }
      ]
    });
    
    console.log(`Found ${res.length} accounts.`);
    let total = 0n;
    
    res.forEach((a, i) => {
      if (a.account.data.length >= 73) {
        const amount = a.account.data.readBigUInt64LE(33);
        const pool = new PublicKey(a.account.data.slice(41, 73));
        if (amount > 0n) {
           console.log(`[${i}] Pool: ${pool.toBase58()}, Amount: ${amount}`);
           total += amount;
        }
      }
    });

    console.log(`Total Staked (Raw): ${total}`);
    console.log(`Total Staked (ACS): ${Number(total / 1000000n)}`);

  } catch (e) {
    console.error('Error:', e.message);
  }
}

verifyBalances();
