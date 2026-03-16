const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

async function scanNftsBatched(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Scanning NFTs for: ${userAddress} (BATCHED)`);
  
  try {
    // 1. Get all token accounts (1 call)
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPk, {
      programId: TOKEN_PROGRAM_ID
    });

    const nftMints = tokenAccounts.value
      .filter(a => {
        const info = a.account.data.parsed.info;
        return info.tokenAmount.uiAmount === 1 && info.tokenAmount.decimals === 0;
      })
      .map(a => new PublicKey(a.account.data.parsed.info.mint));

    console.log(`Found ${nftMints.length} potential NFTs`);
    if (nftMints.length === 0) return;

    // 2. Derive Metadata PDAs
    const metadataPdas = nftMints.map(mint => {
      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        METAPLEX_PROGRAM_ID
      );
      return pda;
    });

    // 3. Fetch Metadata Account Data (BATCHED: 100 per call)
    const metadataAccountInfos = [];
    console.log(`Fetching metadata accounts in batches of 100...`);
    for (let i = 0; i < metadataPdas.length; i += 100) {
      const chunk = metadataPdas.slice(i, i + 100);
      const results = await connection.getMultipleAccountsInfo(chunk);
      metadataAccountInfos.push(...results);
    }

    console.log(`Fetched ${metadataAccountInfos.length} metadata accounts.`);

    let forever = 0;
    let redeemable = 0;

    // 4. Parse URIs and scan traits
    const processBatch = async (accounts) => {
        const promises = accounts.map(async (acc) => {
            if (!acc) return;
            try {
                const data = Buffer.from(acc.data);
                const uriLen = data.readUInt32LE(115);
                const uri = data.slice(115 + 4, 115 + 4 + uriLen).toString().replace(/\0/g, '');
                
                if (uri.startsWith('http')) {
                    const res = await fetch(uri);
                    if (res.ok) {
                        const json = await res.json();
                        const attrs = json.attributes || [];
                        
                        const isForever = attrs.some(a => {
                            const val = String(a.value).toLowerCase();
                            const trait = String(a.trait_type || '').toLowerCase();
                            return val === 'forever' || 
                                   (trait === 'subscription type' && val === 'forever') || 
                                   (trait === 'locked until' && val === 'forever');
                        });

                        const isRedeemable = attrs.some(a => {
                            const val = String(a.value).toLowerCase();
                            const trait = String(a.trait_type || '').toLowerCase();
                            return val === 'redeemable' || 
                                   (trait === 'subscription type' && val === 'redeemable');
                        });

                        if (isForever) {
                            forever++;
                            console.log(`[FOREVER] ${json.name}`);
                        }
                        if (isRedeemable) {
                            redeemable++;
                            console.log(`[REDEEMABLE] ${json.name}`);
                        }
                    }
                }
            } catch (e) {}
        });
        await Promise.all(promises);
    };

    // Split Arweave fetches into smaller parallel batches to avoid overloading
    const ARWEAVE_BATCH_SIZE = 10;
    for (let i = 0; i < metadataAccountInfos.length; i += ARWEAVE_BATCH_SIZE) {
        process.stdout.write('.');
        await processBatch(metadataAccountInfos.slice(i, i + ARWEAVE_BATCH_SIZE));
    }

    console.log(`\n\nFINAL COUNTS for ${userAddress}:`);
    console.log(`Forever: ${forever}`);
    console.log(`Redeemable: ${redeemable}`);

  } catch (e) {
    console.log('\nError:', e.message);
  }
}

scanNftsBatched('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
