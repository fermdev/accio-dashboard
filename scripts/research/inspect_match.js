import fetch from 'node-fetch';

async function inspectMatchedSupporter() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    // We know this address is in 'Veryabd' pool from previous run
    const poolPk = '6kd6BfCxF8K6hV1839mK73yGzXfLw5mE6vWwWwWwWwWw'; // Need to verify this PK
    
    // Let's just scan top pools again but log the FULL object
    const poolsRes = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=100', { headers: hubHeaders });
    const poolsData = await poolsRes.json();
    const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);

    for (const pool of poolList) {
        const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${pool.Pubkey}/locked?per_page=1000`, { headers: hubHeaders });
        if (supRes.ok) {
            const data = await supRes.json();
            const supporters = Array.isArray(data) ? data : (data.supporters || []);
            const match = supporters.find(s => s.pubkey === address || s.address === address);
            if (match) {
                console.log(`MATCH FOUND in pool: ${pool.Name} (${pool.Pubkey})`);
                console.log('Supporter Data (FULL):', JSON.stringify(match, null, 2));
                return;
            }
        }
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectMatchedSupporter();
