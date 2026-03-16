// Quick test: does the DAS API work from a browser?
// Run this in the browser console at http://localhost:5173

async function testDasBrowser() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const rpc = 'https://api.mainnet-beta.solana.com';
  
  try {
    console.log('Testing DAS API from browser...');
    const res = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: '1',
        method: 'getAssetsByOwner',
        params: { ownerAddress: address, page: 1, limit: 10 }
      })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Error:', data.error);
    console.log('Items:', data.result?.items?.length);
    const attrs = data.result?.items?.[0]?.content?.metadata?.attributes;
    console.log('First item attrs:', attrs);
  } catch(e) {
    console.log('CORS/Network Error:', e.message);
  }
}

testDasBrowser();
