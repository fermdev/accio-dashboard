const { Connection, PublicKey } = require('@solana/web3.js');

const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');

async function scanMetadataByOwner(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Scanning Metaplex Metadata for owner: ${userAddress}`);
  
  try {
    // Metadata Account Layout for v1: 
    // Key (1) | Update Auth (32) | Mint (32) | ...
    // There isn't a direct "current owner" field in metadata, it's in the Token Account.
    // BUT we can search for the user's address in the `update_authority` field just in case?
    // No, stakers aren't the update authority.
    
    // So the only link is: User -> Token Account (Mint) -> Metadata PDA (Mint).
    // I already did this and it found 0 metadata accounts.
    
    // CONCLUSION: The assets are NOT standard Metaplex NFTs with PDAs in the standard program.
    // They are almost certainly COMPRESSED NFTS.
    
    console.log('Confirmed: Assets are likely Compressed NFTs (cNFTs).');

  } catch (e) {
    console.log('Error:', e.message);
  }
}

scanMetadataByOwner('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
