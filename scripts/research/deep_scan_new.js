import fetch from 'node-fetch';

async function scanPoolsForNewUser() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    console.log(`Starting deep scan for address: ${address}...`);
    const poolsRes = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=500', { headers: hubHeaders });
    const poolsData = await poolsRes.json();
    const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
    console.log(`Fetched ${poolList.length} pools.`);

    let totalStaked = 0;
    let poolCount = 0;
    const concurrency = 25;
    const foundPools = [];

    for (let i = 0; i < poolList.length; i += concurrency) {
      const batch = poolList.slice(i, i + concurrency);
      await Promise.all(batch.map(async (pool) => {
        try {
          const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pool.Pubkey}/locked?per_page=1000`, { headers: hubHeaders });
          if (supRes.ok) {
            const data = await supRes.json();
            const supporters = Array.isArray(data) ? data : (data.supporters || []);
            const match = supporters.find(s => s.pubkey === address || s.address === address);
            if (match) {
              const amt = Number(match.amount) / 1000000;
              totalStaked += amt;
              poolCount++;
              foundPools.push({ name: pool.Name, amount: amt });
              console.log(`MATCH: ${pool.Name} | ${amt.toLocaleString()} ACS`);
            }
          }
        } catch (e) {
          // console.error(`Error scanning pool ${pool.Name}:`, e.message);
        }
      }));
    }

    console.log('\n--- SCAN COMPLETE ---');
    console.log(`Total Staked: ${totalStaked.toLocaleString()} ACS`);
    console.log(`Pool Count:   ${poolCount}`);
    console.log('Top 5 Pools found:');
    foundPools.sort((a, b) => b.amount - a.amount).slice(0, 5).forEach(p => {
        console.log(`- ${p.name}: ${p.amount.toLocaleString()} ACS`);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

scanPoolsForNewUser();
