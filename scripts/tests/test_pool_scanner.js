async function searchUserInTopPools() {
  const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    console.log('Fetching top pools list...');
    // Try without ?pools=... first
    const poolsRes = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=50', { headers: hubHeaders });
    if (!poolsRes.ok) throw new Error('Failed to fetch pools');
    
    const data = await poolsRes.json();
    // Log keys to identify structure
    console.log('API Response Keys:', Object.keys(data));
    
    const pools = Array.isArray(data) ? data : (data.pools || data.data || []);
    console.log(`Searching ${pools.length} pools for user stakes...`);
    
    if (pools.length === 0) {
      console.log('Full data sample:', JSON.stringify(data).slice(0, 500));
      return;
    }

    let totalLocked = 0n;
    let foundPools = [];

    // Serial for safety and to avoid rate limits initially
    for (const pool of pools) {
      const pubkey = pool.pubkey || pool.address;
      if (!pubkey) continue;
      
      try {
        const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pubkey}/locked`, { headers: hubHeaders });
        if (supRes.ok) {
          const supData = await supRes.json();
          const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
          const supporter = supporters.find(s => s.address === user);
          if (supporter) {
            console.log(`MATCH: ${pool.name || pubkey} - ${supporter.amount}`);
            totalLocked += BigInt(supporter.amount);
            foundPools.push(pool.name || pubkey);
          }
        }
      } catch (e) {
        console.log(`Error in pool ${pool.name}:`, e.message);
      }
    }

    console.log('\n--- SCAN COMPLETE ---');
    console.log(`Total ACS found: ${Number(totalLocked / 1000000n) / 1000}`);
    console.log(`Pools count: ${foundPools.length}`);

  } catch (err) {
    console.log('Error:', err.message);
  }
}

searchUserInTopPools();
