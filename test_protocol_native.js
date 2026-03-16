const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getSubscriptionsProtocolNative(userAddress) {
  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  const HUB_HEADERS = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  console.log(`Checking subscriptions for: ${userAddress}`);
  
  try {
    // 1. Get ALL pools (or just the user's active pools if we have them)
    // To be thorough, we can fetch all 500+ pools and parallel check.
    const poolsRes = await fetch(`${HUB_API_BASE}/pools?per_page=1000`, { headers: HUB_HEADERS });
    const poolsData = await poolsRes.json();
    const allPools = Object.values(poolsData).filter(p => p && p.Pubkey);
    
    console.log(`Scanning ${allPools.length} pools...`);
    
    let foreverCount = 0;
    
    // 2. Parallel check each pool
    // Note: This is heavy, but on server-side it's manageable.
    // However, a better way is to find which pools the user is IN first.
    // But Access Protocol doesn't have a "getPoolsByOwner" in Go-API v1.
    
    // Wait, let's find the user's staked pools first using the RPC approach (safe on server)
    // Or just scan the top 200 pools? Galang is in top.
    
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
                        console.log(`>> FOUND IN ${pool.Name} (${pool.Pubkey})`);
                        foreverCount++;
                    }
                }
            } catch (e) {}
        }
    };
    
    await Promise.all(Array(CONCURRENCY).fill(0).map(() => worker()));
    
    console.log(`Final Forever Count: ${foreverCount}`);
    return foreverCount;

  } catch (e) {
    console.log('Error:', e.message);
  }
}

getSubscriptionsProtocolNative('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
