const { Connection, PublicKey } = require('@solana/web3.js');

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbmeP97ndH2whTHsAFsqJ4f56XFBNDM91');

async function inspectNfts(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Inspecting NFTs for: ${userAddress}`);
  
  try {
    // Check Legacy Token Program
    const legacy = await connection.getParsedTokenAccountsByOwner(userPk, { programId: TOKEN_PROGRAM_ID });
    const legacyNfts = legacy.value.filter(a => a.account.data.parsed.info.tokenAmount.uiAmount === 1);
    console.log(`Found ${legacyNfts.length} Legacy Potential NFTs`);
    if (legacyNfts.length > 0) {
        console.log(`Sample Legacy Mint: ${legacyNfts[0].account.data.parsed.info.mint}`);
    }

    // Check Token-2022
    const t22 = await connection.getParsedTokenAccountsByOwner(userPk, { programId: TOKEN_2022_PROGRAM_ID });
    const t22Nfts = t22.value.filter(a => a.account.data.parsed.info.tokenAmount.uiAmount === 1);
    console.log(`Found ${t22Nfts.length} Token-2022 Potential NFTs`);
    if (t22Nfts.length > 0) {
        console.log(`Sample T22 Mint: ${t22Nfts[0].account.data.parsed.info.mint}`);
    }

  } catch (e) {
    console.log('Error:', e.message);
  }
}

inspectNfts('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
