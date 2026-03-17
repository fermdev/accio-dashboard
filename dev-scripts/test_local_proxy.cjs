const fetch = require('node-fetch');

async function testLocalProxy() {
  const rpcBody = {
    jsonrpc: '2.0',
    id: 'accio-test',
    method: 'getAssetsByOwner',
    params: { 
      ownerAddress: 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6', 
      page: 1, 
      limit: 10 
    }
  };

  console.log('Testing http://localhost:5173/api/das ...');
  try {
    const res = await fetch('http://localhost:5173/api/das', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody)
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text.substring(0, 500));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testLocalProxy();
