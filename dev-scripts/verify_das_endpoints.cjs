const fetch = require('node-fetch');

async function test() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const rpcBody = {
    jsonrpc: '2.0',
    id: 'test',
    method: 'getAssetsByOwner',
    params: { ownerAddress: wallet, page: 1, limit: 1 }
  };

  const endpoints = [
    'https://api.mainnet-beta.solana.com',
    'https://solana-mainnet.g.allnodes.com/',
    'https://rpc.ankr.com/solana',
    'https://solana.publicnode.com',
    'https://api.metaplex.solana.com'
  ];
  
  for (const url of endpoints) {
    console.log(`Testing: ${url}`);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcBody),
        timeout: 5000
      });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          console.log('SUCCESS! Found DAS result at', url);
          return;
        } else {
          console.log('No DAS result (likely standard RPC only)');
        }
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

test();
