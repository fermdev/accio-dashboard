const { Connection, PublicKey } = require('@solana/web3.js');

const CORE_PROGRAM_ID = new PublicKey('CoRePFmCebBhGjsdv6ms2M7BFLFDraW99t66N7bTToL');

async function checkCore(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Checking Core assets for: ${userAddress}`);
  
  try {
    const coreAccounts = await connection.getProgramAccounts(CORE_PROGRAM_ID, {
        filters: [
            { memcmp: { offset: 1 + 32, bytes: userPk.toBase58() } } // Asset Account usually has owner at offset 33
        ]
    });

    console.log(`Found ${coreAccounts.length} potential Core accounts`);
    coreAccounts.forEach(({ pubkey }) => {
        console.log(`- Core Asset: ${pubkey.toBase58()}`);
    });

  } catch (e) {
    console.log('Error:', e.message);
  }
}

checkCore('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
