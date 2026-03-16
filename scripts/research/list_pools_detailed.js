async function listPoolsDetailed() {
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    console.log('Fetching pools...');
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=100', { headers: hubHeaders });
    const pools = await res.json();
    
    // The pools might be an array or under a key
    const poolList = Array.isArray(pools) ? pools : (pools.pools || []);
    
    console.log(`Found ${poolList.length} pools.`);
    
    // Filter for Galang
    const galangPools = poolList.filter(p => (p.name || '').includes('Galang'));
    console.log('Galang Pools:', JSON.stringify(galangPools, null, 2));

    // Also look for other pools the user mentioned: Skyarina, Sugar Lea, Veryabd
    const others = ['Skyarina', 'Sugar Lea', 'Veryabd'];
    const otherPools = poolList.filter(p => others.some(o => (p.name || '').includes(o)));
    console.log('Other Pools Mentioned by User:', JSON.stringify(otherPools, null, 2));

  } catch (err) {
    console.log('Error:', err.message);
  }
}

listPoolsDetailed();
