const { Connection, PublicKey } = require('@solana/web3.js');

async function discoverLayout(walletAddr) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const wallet = new PublicKey(walletAddr);
  const walletBytes = Buffer.from(wallet.toBytes());

  console.log(`--- Discovering Layout for ${walletAddr} ---`);
  
  // This is a heavy call, but we need it once to see the offsets
  const accounts = await connection.getProgramAccounts(programId);
  console.log(`Scanning ${accounts.length} accounts...`);

  const matches = accounts.filter(a => a.account.data.indexOf(walletBytes) !== -1);
  console.log(`Found ${matches.length} matches.`);

  matches.forEach((m, i) => {
    const offset = m.account.data.indexOf(walletBytes);
    const size = m.account.data.length;
    console.log(`  Match ${i}: Offset ${offset}, Size ${size}`);
    
    // Try to find amount (u64)
    // Common offsets for amount: 33, 40, 72, etc.
    if (size >= 80) {
      try {
        const amt33 = m.account.data.readBigUInt64LE(33);
        const amt40 = m.account.data.readBigUInt64LE(40);
        const amt72 = m.account.data.readBigUInt64LE(72);
        console.log(`    Amt@33: ${amt33}, Amt@40: ${amt40}, Amt@72: ${amt72}`);
      } catch (e) {}
    }
  });
}

const WALLET1 = 'CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn';
const WALLET2 = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

(async () => {
  await discoverLayout(WALLET1);
  await discoverLayout(WALLET2);
})();
