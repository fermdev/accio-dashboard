const { Connection, PublicKey } = require('@solana/web3.js');

async function inspectMint(mintAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const mintPk = new PublicKey(mintAddress);
  
  try {
    const info = await connection.getParsedAccountInfo(mintPk);
    console.log('MINT INFO:');
    console.log(JSON.stringify(info, null, 2));
  } catch (e) {
    console.log('Error:', e.message);
  }
}

inspectMint('3xYSQSBdXAYnEm87zqqU1AY7fqtgHJq2bSxkKMGYGAmy');
