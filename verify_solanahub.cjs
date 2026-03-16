const fetch = require('node-fetch');

async function test() {
  const rpcBody = {
    jsonrpc: '2.0',
    id: 'test',
    method: 'getAssetsByOwner',
    params: { 
      ownerAddress: 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6', 
      page: 1, 
      limit: 10,
      displayOptions: { showFungible: true }
    }
  };

  const URL = 'https://rpc.solanahub.app'; 
  
  console.log('Testing Solana Hub Public Access...');
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody)
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Result count:', data.result?.items?.length || 0);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
