import fetch from 'node-fetch';

const HUB_API_BASE = 'https://go-api.accessprotocol.co';
const HUB_HEADERS = {
  'Origin': 'https://hub.accessprotocol.co',
  'Referer': 'https://hub.accessprotocol.co/',
  'Accept': 'application/json'
};

async function benchmarkOptimizedFetch() {
  const userAddress = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  console.log('Benchmarking optimized fetch for:', userAddress);

  const start = Date.now();

  try {
    const userPkStr = userAddress.trim();
    
    // 1. Fetch pools
    console.log('Fetching pools...');
    const poolsRes = await fetch(`${HUB_API_BASE}/pools?order=supporters&per_page=500`, { headers: HUB_HEADERS });
    const poolsData = await poolsRes.json();
    const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
    console.log(`Pools: ${poolList.length}`);

    let totalAcs = 0n;
    const foundPools = [];
    const poolQueue = [...poolList];
    
    // 2. High Concurrency Workers
    const CONCURRENCY = 50;
    
    const scanWorker = async () => {
      while (poolQueue.length > 0) {
        const pool = poolQueue.shift();
        if (!pool) break;
        try {
          const supRes = await fetch(`${HUB_API_BASE}/supporters/${pool.Pubkey}/locked?per_page=1000`, { headers: HUB_HEADERS });
          if (supRes.ok) {
            const supData = await supRes.json();
            const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
            const supporter = supporters.find(s => s.pubkey === userPkStr || s.address === userPkStr);
            if (supporter) {
              totalAcs += BigInt(supporter.amount);
              foundPools.push(pool.Name);
            }
          }
        } catch (e) {}
      }
    };

    console.log(`Starting ${CONCURRENCY} workers...`);
    await Promise.all(Array(CONCURRENCY).fill(0).map(() => scanWorker()));

    const end = Date.now();
    console.log(`\n--- BENCHMARK COMPLETE ---`);
    console.log(`Time: ${end - start}ms`);
    console.log(`Total ACS: ${Number(totalAcs / 1000000n)}`);
    console.log(`Pools: ${foundPools.length}`);

  } catch (err) {
    console.error('Error:', err);
  }
}

benchmarkOptimizedFetch();
