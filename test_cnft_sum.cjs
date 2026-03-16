const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCnftSum() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = 'https://rpc.ankr.com/solana';
  const headers = { 'Content-Type': 'application/json' };

  console.log(`Fetching cNFTs for ${wallet}...`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: wallet,
          page: 1,
          limit: 100
        }
      })
    });

    const data = await res.json();
    if (data.error) {
      console.error('RPC Error:', data.error);
      return;
    }

    const items = data.result.items || [];
    console.log(`Found ${items.length} total assets.`);

    let totalStaked = 0;
    const pools = new Set();

    items.forEach(item => {
      // Access Protocol cNFTs usually have specific metadata or collection
      const metadata = item.content?.metadata;
      const attributes = metadata?.attributes || [];
      
      // Check if it's an Access Protocol subscription
      const isAccess = item.content?.metadata?.symbol === 'ACS' || 
                       item.content?.metadata?.name?.includes('Access Protocol') ||
                       attributes.some(a => a.trait_type === 'Subscription Type');

      if (isAccess) {
        const amountAttr = attributes.find(a => a.trait_type === 'Amount');
        if (amountAttr) {
          const amount = parseFloat(amountAttr.value);
          if (!isNaN(amount)) {
            totalStaked += amount;
            // Try to find pool name or creator name for pool count
            const creatorAttr = attributes.find(a => a.trait_type === 'Creator Pool Name' || a.trait_type === 'Creator Name');
            if (creatorAttr) {
              pools.add(creatorAttr.value);
            } else {
              pools.add(item.id); // Fallback to unique item ID
            }
            console.log(`- Found ${amount} ACS in ${metadata.name}`);
          }
        }
      }
    });

    console.log(`\n--- FINAL TOTALS ---`);
    console.log(`Total Staked: ${totalStaked} ACS`);
    console.log(`Active Pools: ${pools.size}`);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

testCnftSum();
