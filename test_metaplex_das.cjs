const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testMetaplexDas(userAddress) {
  const url = 'https://api.metaplex.solana.com';
  console.log(`Testing Metaplex DAS at: ${url}`);
  
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
            const subType = attrs.find(a => {
                const trait = String(a.trait_type || '').toLowerCase();
                return trait === 'subscription type' || trait === 'locked until';
            })?.value || 'N/A';
            console.log(`- ${name} (Type: ${subType})`);
        });
    } else {
        console.log('Error:', JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.log('Fetch Error:', e.message);
  }
}

// Target User 
testMetaplexDas('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
