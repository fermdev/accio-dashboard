import { Connection, PublicKey } from '@solana/web3.js';

async function testPdaDerivation() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const user = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  
  // Potential pools
  const pools = [
    { name: 'Galang Ferm', pk: 'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97' },
    { name: 'Galang Ferm [NEW]', pk: '3CkE9GMQCue9wd44RughsVHriLve6V6CgxTfFpwn5nMn' },
    { name: 'Skyarina', pk: '8TqS5S...' }, // need full
    { name: 'Sugar Lea', pk: '...' }
  ];

  for (const pool of pools) {
    if (pool.pk.length < 32) continue; // Skip truncated
    const poolPk = new PublicKey(pool.pk);
    
    try {
      // Derive StakeAccount PDA
      const [address, bump] = await PublicKey.findProgramAddress(
        [Buffer.from('stake_account'), user.toBuffer(), poolPk.toBuffer()],
        programId
      );
      
      console.log(`Checking ${pool.name} PDA: ${address.toBase58()}`);
      const acc = await connection.getAccountInfo(address);
      if (acc) {
        console.log(`[!] FOUND STAKE ACCOUNT! Data length: ${acc.data.length}`);
        // Tag 3 = StakeAccount. amount at offset 33 (1 tag + 32 owner)
        const amount = acc.data.readBigUInt64LE(33);
        console.log(`Amount: ${amount.toString()}`);
      }
    } catch (e) {
      console.log(`Error deriving for ${pool.name}:`, e.message);
    }
  }
}

testPdaDerivation();
