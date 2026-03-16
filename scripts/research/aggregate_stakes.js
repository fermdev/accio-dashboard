async function aggregateUserStakes() {
  const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    console.log('Fetching pools...');
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=500', { headers: hubHeaders });
    const data = await res.json();
    const poolList = Object.values(data).filter(p => p && p.Pubkey);
    
    const keywords = ['Galang', 'Skyarina', 'Sugar Lea', 'Veryabd', 'JulesL'];
    const targets = poolList.filter(p => {
        const name = p.Name || '';
        return keywords.some(k => name.toLowerCase().includes(k.toLowerCase()));
    });

    console.log(`Found ${targets.length} potential pools. Checking for user stakes...`);
    
    let totalAcs = 0n;
    let poolNames = [];

    for (const pool of targets) {
        try {
            const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pool.Pubkey}/locked`, { headers: hubHeaders });
            if (supRes.ok) {
                const supData = await supRes.json();
                const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
                const supporter = supporters.find(s => s.address === user);
                if (supporter) {
                    const amount = BigInt(supporter.amount);
                    console.log(`MATCH: ${pool.Name} - ${amount.toString()}`);
                    totalAcs += amount;
                    poolNames.push(pool.Name);
                }
            }
        } catch (e) {
            console.log(`Error in pool ${pool.Name}:`, e.message);
        }
    }

    console.log('\n--- FINAL AGGREGATION ---');
    console.log(`User: ${user}`);
    console.log(`Total ACS: ${Number(totalAcs / 1000000n) / 1000} ACS`);
    console.log(`Pools: ${poolNames.join(', ')} (${poolNames.length} pools)`);

  } catch (err) {
    console.log('Error:', err.message);
  }
}

aggregateUserStakes();
