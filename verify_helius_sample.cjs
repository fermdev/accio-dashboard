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

  // Standard Helius Sample Key
  const URL = 'https://mainnet.helius-rpc.com/?api-key=7d3c5095-2c8c-4a37-9759-9942a7818e3d'; 
  
  console.log('Testing Helius Sample Key...');
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody)
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Result count:', data.result?.items?.length || 0);
    if (data.result?.items?.length > 0) {
      console.log('SUCCESS! Found cNFTs.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
