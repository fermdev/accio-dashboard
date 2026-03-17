const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testExtrnodeDas(userAddress) {
  const url = 'https://solana-mainnet.rpc.extrnode.com';
  console.log(`Testing Extrnode DAS at: ${url}`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'test',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: userAddress,
          page: 1,
          limit: 10,
          displayOptions: { showFungible: false }
        }
      })
    });
    
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    if (data.result) {
        console.log(`SUCCESS! Found ${data.result.items.length} assets`);
    } else {
        console.log('Error:', JSON.stringify(data));
    }
  } catch (e) {
    console.log('Fetch Error:', e.message);
  }
}

// Target User
testExtrnodeDas('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
