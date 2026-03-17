const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');

async function exhaustiveSearch(userAddress) {
  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  const HUB_HEADERS = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
  };

  console.log(`Exhaustive search for: ${userAddress}`);
  
  try {
    const poolsRes = await fetch(`${HUB_API_BASE}/pools?per_page=1000`, { headers: HUB_HEADERS });
    const poolsData = await poolsRes.json();
    const allPools = Object.values(poolsData).filter(p => p && p.Pubkey);
    
    console.log(`Total pools: ${allPools.length}`);
    
    let foundForever = [];
    
    const poolQueue = [...allPools];
    const CONCURRENCY = 50;
    
    const worker = async () => {
        while (poolQueue.length > 0) {
            const pool = poolQueue.shift();
            try {
                const fRes = await fetch(`${HUB_API_BASE}/supporters/${pool.Pubkey}/forever`, { headers: HUB_HEADERS });
                if (fRes.ok) {
                    const fData = await fRes.json();
                    const fList = Array.isArray(fData) ? fData : (fData.pubkeys || []);
                    const found = fList.some(p => {
                        const addr = typeof p === 'string' ? p : (p.pubkey || p.address || '');
                        return addr.toLowerCase() === userAddress.toLowerCase();
                    });
                    if (found) {
                        console.log(`[MATCH] Found in ${pool.Name} (${pool.Pubkey})`);
                        foundForever.push(pool.Name);
                    }
                }
            } catch (e) {}
        }
    };
    
    await Promise.all(Array(CONCURRENCY).fill(0).map(() => worker()));
    
    console.log(`\nFinal result for ${userAddress}: Found in ${foundForever.length} pools.`);
    console.log(JSON.stringify(foundForever));
    fs.writeFileSync('exhaustive_results.txt', JSON.stringify({ userAddress, foundForever }, null, 2));

  } catch (e) {
    console.log('Error:', e.message);
  }
}

// Check the user's reference address
exhaustiveSearch('4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
