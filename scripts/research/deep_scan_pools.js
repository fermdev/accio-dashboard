async function searchAllPools() {
  const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    console.log('Fetching full pools list...');
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=500', { headers: hubHeaders });
    const data = await res.json();
    const poolList = Object.values(data).filter(p => p && p.Pubkey);
    console.log(`Found ${poolList.length} pools. Starting deep scan...`);
    
    let totalLocked = 0n;
    let found = [];

    // Use batches to avoid rate limits
    const BATCH_SIZE = 15;
    for (let i = 0; i < poolList.length; i += BATCH_SIZE) {
        const batch = poolList.slice(i, i + BATCH_SIZE);
        console.log(`Scanning pools ${i} to ${i + batch.length}...`);
        
        await Promise.all(batch.map(async (pool) => {
            try {
                // Try to find if user is in this pool
                // We fetch the FIRST page of supporters (usually up to 100 or 1000)
                // If the user isn't in the top supporters, this might miss them
                // BUT the user has 635K which is likely high enough to be in the list
                const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pool.Pubkey}/locked?per_page=1000`, { headers: hubHeaders });
                if (supRes.ok) {
                    const supData = await supRes.json();
                    const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
                    const supporter = supporters.find(s => s.address === user);
                    if (supporter) {
                        const amount = BigInt(supporter.amount);
                        console.log(`[!] MATCH in ${pool.Name}: ${amount.toString()}`);
                        totalLocked += amount;
                        found.push({ name: pool.Name, amount });
                    }
                }
            } catch (e) {
                // Ignore
            }
        }));
        
        // Small delay between batches
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n--- SCAN RESULTS ---');
    console.log(`Total ACS: ${Number(totalLocked / 1000000n) / 1000} ACS`);
    console.log(`Pools: ${found.map(f => f.name).join(', ')}`);

  } catch (err) {
    console.log('Error:', err.message);
  }
}

searchAllPools();
