import fetch from 'node-fetch';

async function fetchUserCfts() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  // Attempting to use a public DAS RPC or the Access Protocol WRPC
  const rpcUrl = 'https://rpc.ankr.com/solana'; // If this fails, I'll try WRPC

  console.log(`Fetching cNFTs for address: ${address}`);
  
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'get-assets',
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
        // Fallback to WRPC
        console.log('Trying WRPC...');
        const wrpcRes = await fetch('https://wrpc.accessprotocol.co', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Origin': 'https://hub.accessprotocol.co',
                'Referer': 'https://hub.accessprotocol.co/'
            },
            body: JSON.stringify({
                jsonrpc: '2.0', id: 'get-assets', method: 'getAssetsByOwner',
                params: { ownerAddress: address, page: 1, limit: 100 }
            })
        });
        const wrpcData = await wrpcRes.json();
        console.log('WRPC Items Found:', wrpcData.result?.items?.length || 0);
        if (wrpcData.result?.items) {
           inspectAssets(wrpcData.result.items);
        }
    } else {
        inspectAssets(data.result.items);
    }
  } catch (err) {
    console.log('Fetch Error:', err.message);
  }
}

function inspectAssets(assets) {
    console.log(`Total Assets: ${assets.length}`);
    const accessAssets = assets.filter(a => 
        a.content?.metadata?.symbol === 'ACS' || 
        a.content?.metadata?.name?.includes('Access Protocol') ||
        a.grouping?.find(g => g.group_key === 'collection' && g.group_value === 'ACS1Collection') // Sample collection
    );
    console.log(`Access Protocol Assets: ${accessAssets.length}`);
    
    accessAssets.forEach((a, i) => {
        console.log(`\nAsset #${i}: ${a.content?.metadata?.name}`);
        const attributes = a.content?.metadata?.attributes || [];
        console.log('Attributes:', JSON.stringify(attributes, null, 2));
    });
}

fetchUserCfts();
