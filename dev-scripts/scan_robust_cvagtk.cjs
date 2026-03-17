const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

async function scanNftsRobust(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Robust Scanning NFTs for: ${userAddress}`);
  
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPk, {
      programId: TOKEN_PROGRAM_ID
    });

    const nftAccountInfos = tokenAccounts.value.filter(a => {
      const info = a.account.data.parsed.info;
      return info.tokenAmount.uiAmount === 1 && info.tokenAmount.decimals === 0;
    });

    console.log(`Found ${nftAccountInfos.length} potential NFTs`);
    
    // Batch fetch metadata account data
    const mints = nftAccountInfos.map(a => new PublicKey(a.account.data.parsed.info.mint));
    const metadataPdas = mints.map(mint => {
      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        METAPLEX_PROGRAM_ID
      );
      return pda;
    });

    const accountInfos = [];
    for (let i = 0; i < metadataPdas.length; i += 100) {
        const chunk = metadataPdas.slice(i, i + 100);
        const results = await connection.getMultipleAccountsInfo(chunk);
        accountInfos.push(...results);
    }

    let forever = 0;
    let redeemable = 0;

    for (let i = 0; i < accountInfos.length; i++) {
        const acc = accountInfos[i];
        if (!acc) continue;

        const data = acc.data;
        const dataStr = data.toString('utf8');
        const httpIdx = dataStr.indexOf('http');
        
        if (httpIdx !== -1) {
            try {
                // Read length prefix before http
                const len = data.readUInt32LE(httpIdx - 4);
                // Sanity check length
                if (len > 0 && len < 500) {
                    const uri = data.slice(httpIdx, httpIdx + len).toString().replace(/\0/g, '');
                    const res = await fetch(uri);
                    if (res.ok) {
                        const json = await res.json();
                        const attrs = json.attributes || [];
                        const st = attrs.find(a => {
                            const t = String(a.trait_type || '').toLowerCase();
                            return t === 'subscription type' || t === 'locked until';
                        })?.value || '';
                        
                        if (st.toLowerCase() === 'forever') forever++;
                        if (st.toLowerCase() === 'redeemable') redeemable++;
                        
                        if (st) console.log(`- ${json.name}: ${st}`);
                    }
                }
            } catch (e) {}
        }
    }

    console.log(`\nFINAL COUNTS for ${userAddress}:`);
    console.log(`Forever: ${forever}`);
    console.log(`Redeemable: ${redeemable}`);

  } catch (e) {
    console.log('Error:', e.message);
  }
}

scanNftsRobust('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
