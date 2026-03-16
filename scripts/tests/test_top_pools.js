async function testTopPoolsSearch() {
  const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  
  try {
    console.log('Fetching top pools...');
    const poolsRes = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=100', {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });
    
    if (!poolsRes.ok) {
      console.log('Failed to fetch pools');
      return;
    }
    
    const poolsData = await poolsRes.json();
    const pools = poolsData.pools || [];
    console.log(`Found ${pools.length} pools. Searching for user stakes...`);
    
    let totalAcs = 0;
    let foundInPools = [];

    // Query each pool for supporters (top 100 for now to be fast)
    // In a real implementation, we would do this more efficiently
    for (const pool of pools.slice(0, 50)) {
      try {
        const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pool.pubkey}/locked`, {
          headers: {
            'Origin': 'https://hub.accessprotocol.co',
            'Referer': 'https://hub.accessprotocol.co/'
          }
        });
        
        if (supRes.ok) {
          const supData = await supRes.json();
          const supporter = (supData.supporters || []).find(s => s.address === user);
          if (supporter) {
            console.log(`FOUND stake in pool: ${pool.name} - Amount: ${supporter.amount}`);
            totalAcs += parseFloat(supporter.amount);
            foundInPools.push(pool.name);
          }
        }
      } catch (e) {
        // Ignore single pool failures
      }
    }
    
    console.log('\n--- FINAL RESULTS ---');
    console.log(`Total ACS found: ${totalAcs / 1e9}`);
    console.log(`Pools found: ${foundInPools.join(', ')}`);
    
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testTopPoolsSearch();
