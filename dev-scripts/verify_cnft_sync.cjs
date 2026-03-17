const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifySync() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = 'https://wrpc.accessprotocol.co/'; // This works in node with headers usually
  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  console.log(`Verifying sync aggregation for ${wallet}...`);

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
    let totalStaked = 0;
    const pools = new Set();

    items.forEach(item => {
      const attributes = item.content?.metadata?.attributes || [];
      const isAccess = item.content?.metadata?.symbol === 'ACS' || 
                       attributes.some(a => a.trait_type === 'Subscription Type');

      if (isAccess) {
        const amountAttr = attributes.find(a => a.trait_type === 'Amount');
        if (amountAttr) {
          const amount = parseFloat(amountAttr.value);
          if (!isNaN(amount)) {
            totalStaked += amount;
            const poolAttr = attributes.find(a => a.trait_type === 'Creator Pool Name' || a.trait_type === 'Creator Name');
            if (poolAttr) pools.add(poolAttr.value);
            else pools.add(item.id);
          }
        }
      }
    });

    console.log(`\n--- Verification Results ---`);
    console.log(`Total Staked: ${Math.floor(totalStaked).toLocaleString()} ACS`);
    console.log(`Active Pools: ${pools.size}`);
    
    if (totalStaked > 300000) {
      console.log('✅ PASS: Detected large cNFT stake.');
    } else {
      console.log('❌ FAIL: Expected > 300k ACS.');
    }

  } catch (err) {
    console.error('Verification Error:', err.message);
  }
}

verifySync();
