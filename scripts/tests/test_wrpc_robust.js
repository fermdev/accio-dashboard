async function testWrpcRobust() {
  const RPC = 'https://wrpc.accessprotocol.co';
  const WALLET = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

  try {
    console.log(`Testing WRPC (Robust): ${RPC}`);
    const response = await fetch(RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'test',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: WALLET,
          page: 1,
          limit: 100
        },
      }),
    });
    
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log('Body (first 500 chars):', text.slice(0, 500));
    
    try {
      const data = JSON.parse(text);
      if (data.result) {
        console.log('SUCCESS!');
        console.log('Total assets found:', data.result.total);
      }
    } catch (e) {
      console.log('Not JSON response.');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testWrpcRobust();
