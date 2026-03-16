const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DAS_RPC = 'https://api.mainnet-beta.solana.com'; // Simulating what worked in debug

const fetchSubscriptionTypeCounts = async (userAddress) => {
  const endpoints = [DAS_RPC, 'https://solana-mainnet.g.allnodes.com', 'https://api.mainnet-beta.solana.com'];

  for (const endpoint of endpoints) {
    let forever = 0;
    let redeemable = 0;
    let page = 1;
    let success = false;

    try {
      console.log(`[SIM] Attempting via: ${endpoint}`);
      while (true) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'get-assets-' + Date.now(),
            method: 'getAssetsByOwner',
            params: {
              ownerAddress: userAddress,
              page,
              limit: 1000,
              displayOptions: { showFungible: false }
            }
          })
        });

        const data = await res.json();
        const items = data.result?.items || [];
        if (items.length === 0) break;

        items.forEach(item => {
          const attrs = item.content?.metadata?.attributes || [];
          const hasForever = attrs.some(a => String(a.value).toLowerCase() === 'forever');
          const hasRedeemable = attrs.some(a => String(a.value).toLowerCase() === 'redeemable');
          
          if (hasForever) forever++;
          if (hasRedeemable) redeemable++;
        });

        if (items.length < 1000) {
          success = true;
          break;
        }
        page++;
      }
      
      if (success) {
        console.log(`[SIM] SUCCESS via ${endpoint}: Forever=${forever}, Redeemable=${redeemable}`);
        return { forever, redeemable };
      }
    } catch (e) {
       console.log(`[SIM] Endpoint ${endpoint} failed: ${e.message}`);
    }
  }

  return { forever: 0, redeemable: 0 };
};

const target = '4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP';
fetchSubscriptionTypeCounts(target).then(res => {
    console.log('\nFINAL VERIFICATION:', res);
});
