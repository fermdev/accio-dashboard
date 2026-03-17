const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testHubApiDas(userAddress) {
  const url = 'https://hub-api.accessprotocol.co/v1/das-rpc';
  console.log(`Testing Hub-API DAS at: ${url}`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'Accept': 'application/json'
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
    if (data.result) {
        console.log(`SUCCESS! Found ${data.result.items.length} assets`);
        data.result.items.forEach(item => {
            const name = item.content?.metadata?.name || 'Untitled';
            const attrs = item.content?.metadata?.attributes || [];
            const type = attrs.find(a => a.trait_type === 'Subscription Type')?.value || 'N/A';
            console.log(`- ${name} (Type: ${type})`);
        });
    } else {
        console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log('Fetch Error:', e.message);
  }
}

testHubApiDas('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
