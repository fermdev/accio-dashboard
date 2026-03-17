const { Connection, PublicKey } = require('@solana/web3.js');

const BUBBLEGUM_PROGRAM_ID = new PublicKey('BGUMAp9Gqc7yBsCcR9QQfbajbhXp9X1TTCB6KUnMcNf');

async function checkCompressed(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Checking for compressed assets for: ${userAddress}`);
  
  try {
    // Bubblegum stores things in Merkle Trees. We can't easily find a user's items 
    // without a DAS indexer. But we can check if they have any accounts related 
    // to known Access Protocol trees if we had them.
    
    // For now, let's just see if getProgramAccounts finds anything for the owner.
    // (Unlikely, as cNFTs aren't accounts).
    const accounts = await connection.getProgramAccounts(BUBBLEGUM_PROGRAM_ID, {
        filters: [{ memcmp: { offset: 0, bytes: userPk.toBase58() } }]
    });

    console.log(`Found ${accounts.length} Bubblegum accounts`);

  } catch (e) {
    console.log('Error:', e.message);
  }
}

checkCompressed('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
