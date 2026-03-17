const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

async function scanNftsManually(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Scanning NFTs for: ${userAddress}`);
  
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPk, {
      programId: TOKEN_PROGRAM_ID
    });

    const nfts = tokenAccounts.value.filter(a => {
      const info = a.account.data.parsed.info;
      return info.tokenAmount.uiAmount === 1 && info.tokenAmount.decimals === 0;
    });

    console.log(`Found ${nfts.length} potential NFTs`);
    
    let forever = 0;
    let redeemable = 0;

    for (const nft of nfts) {
      const mint = new PublicKey(nft.account.data.parsed.info.mint);
      
      try {
        const [metadataPda] = PublicKey.findProgramAddressSync(
          [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
          METAPLEX_PROGRAM_ID
        );

        const accInfo = await connection.getAccountInfo(metadataPda);
        if (accInfo) {
          const data = accInfo.data;
          // Offset for URI length: 1 + 32 + 32 + 36 + 14 = 115
          const uriLen = data.readUInt32LE(115);
          const uri = data.slice(115 + 4, 115 + 4 + uriLen).toString().replace(/\0/g, '');
          
          if (uri.startsWith('http')) {
            const res = await fetch(uri);
            if (res.ok) {
              const json = await res.json();
              const attrs = json.attributes || [];
              const subType = attrs.find(a => a.trait_type === 'Subscription Type')?.value || '';
              console.log(`- NFT: ${json.name} | Type: ${subType}`);
              
              if (subType.toLowerCase() === 'forever') forever++;
              if (subType.toLowerCase() === 'redeemable') redeemable++;
            }
          }
        }
      } catch (e) {
        // console.log(`Error checking NFT ${mint}: ${e.message}`);
      }
    }

    console.log(`\nFINAL COUNTS for ${userAddress}:`);
    console.log(`Forever: ${forever}`);
    console.log(`Redeemable: ${redeemable}`);

  } catch (e) {
    console.log('Error:', e.message);
  }
}

// User reference from user's request
scanNftsManually('4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
