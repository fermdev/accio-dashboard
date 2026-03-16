const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWrpcDas(userAddress) {
  const url = 'https://wrpc.accessprotocol.co/';
  console.log(`--- Testing WRPC DAS for User: ${userAddress} ---`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://hub.accessprotocol.co' 
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'test',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: userAddress,
          page: 1,
          limit: 100,
          displayOptions: { showFungible: false }
        }
      })
    });
    
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    if (data.error) {
      console.log('RPC Error:', data.error);
    } else {
      const items = data.result?.items || [];
      console.log(`Found ${items.length} assets`);
      if (items.length > 0) {
        // Count Forever/Redeemable
        let forever = 0;
        let redeemable = 0;
        
        items.forEach(item => {
           const attrs = item.content?.metadata?.attributes || [];
           const val = attrs.find(a => a.trait_type === 'Subscription Type')?.value || '';
           if (String(val).toLowerCase() === 'forever') forever++;
           if (String(val).toLowerCase() === 'redeemable') redeemable++;
        });
        
        console.log(`Detected: Forever=${forever}, Redeemable=${redeemable}`);
      }
    }
  } catch (e) {
    console.log('Fetch Error:', e.message);
  }
}

testWrpcDas('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
