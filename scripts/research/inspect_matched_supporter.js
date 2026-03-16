import fetch from 'node-fetch';

async function inspectMatchedSupporter() {
  const testAddress = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    console.log('Finding a pool for user...');
    const poolsRes = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=100', { headers: hubHeaders });
    const poolsData = await poolsRes.json();
    const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);

    for (const pool of poolList) {
        const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pool.Pubkey}/locked?per_page=1000`, { headers: hubHeaders });
        if (supRes.ok) {
            const data = await supRes.json();
            const supporters = Array.isArray(data) ? data : (data.supporters || []);
            const match = supporters.find(s => s.pubkey === testAddress || s.address === testAddress);
            if (match) {
                console.log(`MATCH FOUND in pool: ${pool.Name}`);
                console.log('Supporter Data:', JSON.stringify(match, null, 2));
                return;
            }
        }
    }
    console.log('No matches found in top 100 pools.');
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectMatchedSupporter();
