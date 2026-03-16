const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function inspectAssets(userAddress) {
  const endpoint = 'https://api.mainnet-beta.solana.com';
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'getAssetsByOwner',
        params: { ownerAddress: userAddress, page: 1, limit: 1000 }
      })
    });

    const data = await res.json();
    const items = data.result?.items || [];

    const matches = items.filter(item => 
        JSON.stringify(item.content?.metadata?.attributes || []).includes('Forever')
    );

    console.log(`Found ${matches.length} assets with "Forever"`);
    matches.forEach(item => {
        const attrs = item.content?.metadata?.attributes || [];
        const foreverAttr = attrs.find(a => String(a.value) === 'Forever');
        if (foreverAttr) {
            console.log(`NAME: ${item.content?.metadata?.name}`);
            console.log(`TRAIT: ${foreverAttr.trait_type} | VALUE: ${foreverAttr.value}`);
        } else {
            console.log(`NAME: ${item.content?.metadata?.name} (Forever found in string but not as exact value)`);
            console.log(`ALL ATTRS:`, JSON.stringify(attrs));
        }
    });

  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

const target = '4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP';
inspectAssets(target);
