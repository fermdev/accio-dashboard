const { Connection, PublicKey } = require('@solana/web3.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');

async function inspectMetadata(mintAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const mintPk = new PublicKey(mintAddress);
  
  try {
    const [metadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mintPk.toBuffer()],
      METAPLEX_PROGRAM_ID
    );

    const accInfo = await connection.getAccountInfo(metadataPda);
    if (!accInfo) {
        console.log('Metadata account not found');
        return;
    }

    const data = accInfo.data;
    console.log(`Metadata Data Length: ${data.length}`);
    
    // Look for a URI (starts with http) in the buffer
    const dataStr = data.toString('utf8');
    const httpIdx = dataStr.indexOf('http');
    if (httpIdx !== -1) {
        // Find the length prefix before it
        const len = data.readUInt32LE(httpIdx - 4);
        const uri = data.slice(httpIdx, httpIdx + len).toString().replace(/\0/g, '');
        console.log(`Found URI at index ${httpIdx}: ${uri}`);
        
        const res = await fetch(uri);
        const json = await res.json();
        console.log('JSON Attributes:');
        console.log(JSON.stringify(json.attributes, null, 2));
    } else {
        console.log('No http URI found in buffer');
    }

  } catch (e) {
    console.log('Error:', e.message);
  }
}

inspectMetadata('3xYSQSBdXAYnEm87zqqU1AY7fqtgHJq2bSxkKMGYGAmy');
