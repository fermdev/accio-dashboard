import fetch from 'node-fetch';

const HUB_API_BASE = 'https://go-api.accessprotocol.co';
const HUB_HEADERS = {
  'Origin': 'https://hub.accessprotocol.co',
  'Referer': 'https://hub.accessprotocol.co/',
  'Accept': 'application/json'
};

async function testFinalLogic() {
  const userAddress = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  console.log('Testing logic for:', userAddress);

  try {
    const userPkStr = userAddress.trim();
    
    console.log('Fetching creator pools...');
    const poolsRes = await fetch(`${HUB_API_BASE}/pools?order=supporters&per_page=500`, { headers: HUB_HEADERS });
    if (!poolsRes.ok) throw new Error('Failed to fetch pools');
    
    const poolsData = await poolsRes.json();
    const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
    console.log(`Found ${poolList.length} pools.`);

    let totalAcs = 0n;
    const foundPools = [];

    const BATCH_SIZE = 30;
    for (let i = 0; i < poolList.length; i += BATCH_SIZE) {
      const batch = poolList.slice(i, i + BATCH_SIZE);
      console.log(`Scanning batch ${Math.floor(i/BATCH_SIZE) + 1}...`);
      
      await Promise.all(batch.map(async (pool) => {
        try {
          const supRes = await fetch(`${HUB_API_BASE}/supporters/${pool.Pubkey}/locked?per_page=1000`, { headers: HUB_HEADERS });
          if (supRes.ok) {
            const supData = await supRes.json();
            const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
            const supporter = supporters.find(s => s.pubkey === userPkStr || s.address === userPkStr);
            if (supporter) {
              const amount = BigInt(supporter.amount);
              console.log(`MATCH: ${pool.Name} - ${amount.toString()}`);
              totalAcs += amount;
              foundPools.push(pool.Name);
            }
          }
        } catch (e) {
        }
      }));
    }

    const finalAcs = Number(totalAcs / 1000000n) / 1000;
    console.log(`\n--- FINAL RESULT ---`);
    console.log(`Total ACS: ${finalAcs}`);
    console.log(`Pool Count: ${foundPools.length}`);
    console.log(`Pools: ${foundPools.join(', ')}`);

  } catch (err) {
    console.error('Error:', err);
  }
}

testFinalLogic();
