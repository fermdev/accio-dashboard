async function testWrpc() {
  const RPC = 'https://wrpc.accessprotocol.co';
  const WALLET = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

  try {
    console.log(`Testing WRPC DAS: ${RPC}`);
    const response = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const data = await response.json();
    if (data.result) {
      console.log('Success! Assets found:', data.result.total);
      if (data.result.items.length > 0) {
        console.log('First item sample:', JSON.stringify(data.result.items[0], null, 2).slice(0, 500));
      }
      return;
    } else {
      console.log('Fail:', JSON.stringify(data.error || data));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testWrpc();
