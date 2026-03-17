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

  console.log('Testing WRPC with Hub headers...');
  try {
    const res = await fetch('https://wrpc.accessprotocol.co/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      },
      body: JSON.stringify(rpcBody)
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Result count:', data.result?.items?.length || 0);
    if (data.result?.items?.length > 0) {
      console.log('First item title:', data.result.items[0].content?.metadata?.name);
    } else {
      console.log('Full response:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
