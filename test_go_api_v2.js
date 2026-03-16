const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testGoApiV2(userAddress) {
  // We'll test with the target address and a pool it supports
  // Target: HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6
  // One of its pools: 4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP (AlphaCoded)
  const poolPk = '4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP';
  
  console.log(`--- Testing Go-API V2 Endpoints for Pool: ${poolPk} ---`);
  
  const endpoints = ['forever', 'redeemable', 'locked'];
  
  for (const type of endpoints) {
    const url = `https://go-api.accessprotocol.co/supporters/${poolPk}/${type}`;
    console.log(`\nTesting: ${url}`);
    
    try {
      const res = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Accept': 'application/json'
        }
      });
      
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.supporters || data.pubkeys || []);
        console.log(`Found ${items.length} subscribers of type ${type}`);
        
        // Check if our target user is in here
        const found = items.some(p => p === userAddress || p.pubkey === userAddress || p.address === userAddress);
        console.log(`Target user in list: ${found}`);
        if (items.length > 0) {
            console.log('Sample item:', JSON.stringify(items[0], null, 2));
        }
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

const target = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
testGoApiV2(target);
