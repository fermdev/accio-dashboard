import fetch from 'node-fetch';

async function testWrpcDas() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const rpcUrl = 'https://wrpc.accessprotocol.co';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  console.log('Testing getAssetsByOwner on WRPC...');
  
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: hubHeaders,
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
        const assets = data.result?.items || [];
        console.log(`Found ${assets.length} assets.`);
        
        const accessAssets = assets.filter(a => 
            a.content?.metadata?.symbol === 'ACS' || 
            a.content?.metadata?.name?.includes('Access Protocol')
        );
        
        console.log(`Access Protocol assets: ${accessAssets.length}`);
        if (accessAssets.length > 0) {
            accessAssets.forEach((a, i) => {
                console.log(`\nAsset ${i}: ${a.content?.metadata?.name}`);
                console.log('Attributes:', JSON.stringify(a.content?.metadata?.attributes || [], null, 2));
            });
        }
    }
  } catch (err) {
    console.log('Fetch Error:', err.message);
  }
}

testWrpcDas();
