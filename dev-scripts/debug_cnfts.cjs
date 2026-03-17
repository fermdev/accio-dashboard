const fetch = require('node-fetch');

async function debugCnfts() {
  const URL = 'https://api.mainnet-beta.solana.com';
  const rpcBody = {
    jsonrpc: '2.0',
    id: 'test',
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6',
      page: 1,
      limit: 100
    }
  };

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody)
    });
    
    if (res.ok) {
        const data = await res.json();
        const items = data.result?.items || [];
        console.log(`Found ${items.length} assets.`);
        
        const accessItems = items.filter(i => {
            const name = i.content?.metadata?.name || '';
            const symbol = i.content?.metadata?.symbol || '';
            const attrs = i.content?.metadata?.attributes || i.metadata?.attributes || i.attributes || [];
            return name.includes('Access') || symbol === 'ACS' || attrs.some(a => String(a.value).includes('Access Protocol'));
        });

        console.log(`Filtered down to ${accessItems.length} Access assets.`);
        
        for (let i = 0; i < Math.min(5, accessItems.length); i++) {
            const item = accessItems[i];
            console.log(`\n--- Item ${i+1} ---`);
            console.log(`Name:`, item.content?.metadata?.name);
            console.log(`Symbol:`, item.content?.metadata?.symbol);
            
            const attrs = item.content?.metadata?.attributes || item.metadata?.attributes || item.attributes || [];
            console.log('Attributes:');
            attrs.forEach(a => console.log(`  [${a.trait_type}]: ${a.value}`));
        }
    }
  } catch (err) {
    console.log('Exception:', err.message);
  }
}

debugCnfts();
