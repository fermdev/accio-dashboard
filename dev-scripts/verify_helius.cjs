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

  // Try Helius Public (often works for light usage)
  const HELIUS_URL = 'https://mainnet.helius-rpc.com/?api-key=accio-dummy'; 
  
  console.log('Testing Helius...');
  try {
    const res = await fetch(HELIUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody)
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Result count:', data.result?.items?.length || 0);
    if (data.result?.items?.length > 0) {
      console.log('Success! Found items.');
    } else {
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
