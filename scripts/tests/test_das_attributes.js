import fetch from 'node-fetch';

async function testDasAttributes() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const rpcUrl = 'https://rpc.ankr.com/solana';

  console.log('Testing getAssetsByOwner on Ankr...');
  
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'test-das',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: address,
          page: 1,
          limit: 100,
          displayOptions: {
            showMetadata: true,
            showAttributes: true
          }
        }
      })
    });

    const data = await res.json();
    if (data.error) {
        console.log('RPC Error:', data.error);
    } else {
        const assets = data.result.items;
        console.log(`Found ${assets.length} assets.`);
        
        // Look for Access Protocol subscriptions
        const accessAssets = assets.filter(a => 
            a.content?.metadata?.symbol === 'ACS' || 
            a.content?.metadata?.name?.includes('Access Protocol')
        );
        
        console.log(`Access Protocol assets: ${accessAssets.length}`);
        if (accessAssets.length > 0) {
            console.log('Sample Asset Attributes:', JSON.stringify(accessAssets[0].content?.metadata?.attributes || [], null, 2));
        }
    }
  } catch (err) {
    console.log('Fetch Error:', err.message);
  }
}

testDasAttributes();
