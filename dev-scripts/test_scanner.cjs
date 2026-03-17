const fetch = require('node-fetch');

async function testHighConcurrency() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  console.log(`Scanning all pools for ${wallet}...`);

  try {
    const poolsRes = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=500', {
      headers: { 'Origin': 'https://hub.accessprotocol.co' }
    });
    
    if (!poolsRes.ok) {
        console.log('Failed to fetch pools');
        return;
    }
    
    const poolsData = await poolsRes.json();
    const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
    console.log(`Fetched ${poolList.length} pools. Starting scan...`);

    let totalAcs = 0n;
    const foundPools = new Set();
    
    const CONCURRENCY = 25; 
    const poolQueue = [...poolList];
    
    const scanWorker = async () => {
      while (poolQueue.length > 0) {
        const pool = poolQueue.shift();
        if (!pool) break;
        
        try {
          const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pool.Pubkey}/locked?per_page=1000`, { 
            headers: { 'Origin': 'https://hub.accessprotocol.co' }
          });
          
          if (supRes.ok) {
            const supData = await supRes.json();
            const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
            const supporter = supporters.find(s => s.pubkey === wallet || s.address === wallet);
            if (supporter) {
              const amount = BigInt(Math.floor(Number(supporter.amount)));
              console.log(`Found in ${pool.Name}: ${Number(amount)/1e6} ACS`);
              totalAcs += amount;
              foundPools.add(pool.Name);
            }
          }
        } catch (e) {
          // Ignore
        }
      }
    };

    const workers = Array(CONCURRENCY).fill(0).map(() => scanWorker());
    await Promise.all(workers);

    console.log(`\nFinal Result: ${Number(totalAcs / 1000000n)} ACS across ${foundPools.size} pools.`);
    console.log('Pools:', Array.from(foundPools));

  } catch (e) {
    console.log('Error:', e.message);
  }
}

testHighConcurrency();
