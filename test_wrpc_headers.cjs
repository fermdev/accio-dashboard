const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWrpcWithHeaders(userAddress) {
  const url = 'https://wrpc.accessprotocol.co';
  console.log(`Testing WRPC with Browser Headers at: ${url}`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
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
    const text = await res.text();
    if (res.ok) {
        const data = JSON.parse(text);
        if (data.result) {
            console.log(`SUCCESS! Found ${data.result.items.length} assets`);
        } else {
            console.log('RPC Error:', JSON.stringify(data));
        }
    } else {
        console.log('Error Body Preview:', text.slice(0, 500));
    }
  } catch (e) {
    console.log('Fetch Error:', e.message);
  }
}

// Target User
testWrpcWithHeaders('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
