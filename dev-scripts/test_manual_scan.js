import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

async function scanNftsManually(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);
  const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');

  console.log(`--- Manual NFT Scan for User: ${userAddress} ---`);

  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPk, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
    });

    const nfts = tokenAccounts.value.filter(a => {
      const info = a.account.data.parsed.info;
      return info.tokenAmount.uiAmount === 1 && info.tokenAmount.decimals === 0;
    });

    console.log(`Found ${nfts.length} potential NFTs`);

    const mints = nfts.map(n => new PublicKey(n.account.data.parsed.info.mint));
    const metadataPdas = mints.map(mint => {
      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        METAPLEX_PROGRAM_ID
      );
      return pda;
    });

    console.log(`Fetching metadata accounts...`);
    const accounts = await connection.getMultipleAccountsInfo(metadataPdas);

    let forever = 0;
    let redeemable = 0;

    for (const acc of accounts) {
        if (!acc) continue;
        const data = Buffer.from(acc.data);
        const uriLen = data.readUInt32LE(115);
        const uri = data.slice(115 + 4, 115 + 4 + uriLen).toString().replace(/\0/g, '');
        console.log(`URI Found: ${uri}`);
        
        try {
          const res = await fetch(uri);
          if (res.ok) {
            const json = await res.json();
            const attrs = json.attributes || [];
            const isForever = attrs.some(a => String(a.value).toLowerCase() === 'forever');
            const isRedeemable = attrs.some(a => String(a.value).toLowerCase() === 'redeemable');
            if (isForever) {
                console.log(`>> MATCH: Forever in ${json.name}`);
                forever++;
            }
            if (isRedeemable) {
                console.log(`>> MATCH: Redeemable in ${json.name}`);
                redeemable++;
            }
          }
        } catch (e) {
            console.log(`Failed to fetch JSON: ${e.message}`);
        }
    }

    console.log(`Final Result: Forever=${forever}, Redeemable=${redeemable}`);
  } catch (e) {
    console.log('Error:', e.message);
  }
}

scanNftsManually('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
