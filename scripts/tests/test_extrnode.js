async function testExtrnode() {
  const RPC = 'https://solana-mainnet.rpc.extrnode.com';
  const WALLET = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

  try {
    console.log(`Testing Extrnode DAS: ${RPC}`);
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
      return;
    } else {
      console.log('Fail:', JSON.stringify(data.error || data));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testExtrnode();
