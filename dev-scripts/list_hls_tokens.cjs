const { Connection, PublicKey } = require('@solana/web3.js');

async function listTokens() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const wallet = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
  
  console.log(`Listing tokens for ${wallet.toBase58()}...`);
  try {
    const tokens = await connection.getParsedTokenAccountsByOwner(wallet, { 
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') 
    });
    
    tokens.value.forEach(t => {
      const info = t.account.data.parsed.info;
      console.log(`Mint: ${info.mint}, Amount: ${info.tokenAmount.uiAmount}`);
    });
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

listTokens();
