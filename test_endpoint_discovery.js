const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function discoverEndpoints(userAddress) {
  // AlphaCoded Pool (where user is supposed to have subs)
  const poolPk = '4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP';
  
  const trials = [
    'forever',
    'redeemable',
    'subscriptions',
    'exclusive',
    'bonus',
    'v2',
    'nfts'
  ];
  
  console.log(`--- Discovering endpoints for Pool: ${poolPk} ---`);
  
  for (const trial of trials) {
    const url = `https://go-api.accessprotocol.co/supporters/${poolPk}/${trial}`;
    try {
      const res = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Accept': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.supporters || data.pubkeys || []);
        console.log(`[SUCCESS] ${trial}: Found ${items.length} items`);
        
        const found = items.some(p => {
            const pStr = typeof p === 'string' ? p : (p.pubkey || p.address || '');
            return pStr.toLowerCase() === userAddress.toLowerCase();
        });
        
        console.log(`  Target user found: ${found}`);
        if (items.length > 0) {
            console.log(`  Sample:`, JSON.stringify(items[0]));
        }
      } else {
        console.log(`[FAILED] ${trial}: ${res.status}`);
      }
    } catch (e) {
      console.log(`[ERROR] ${trial}: ${e.message}`);
    }
  }
}

const target = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
discoverEndpoints(target);
