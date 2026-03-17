const { Connection, PublicKey } = require('@solana/web3.js');

const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');

async function scanMetadataMemcmp(mintAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const mintPk = new PublicKey(mintAddress);
  
  try {
    const Metadata = await connection.getProgramAccounts(METAPLEX_PROGRAM_ID, {
        filters: [
            { memcmp: { offset: 33, bytes: mintPk.toBase58() } }
        ]
    });

    console.log(`Found ${Metadata.length} metadata accounts for mint ${mintAddress}`);
    if (Metadata.length > 0) {
        console.log(`Metadata Hex Samples: ${Metadata[0].account.data.slice(0, 100).toString('hex')}`);
    }

  } catch (e) {
    console.log('Error:', e.message);
  }
}

// Test with one of the potential mints from the robust scan
scanMetadataMemcmp('3xYSQSBdXAYnEm87zqqU1AY7fqtgHJq2bSxkKMGYGAmy');
