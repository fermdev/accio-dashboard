async function listPoolsCorrected() {
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=100', { headers: hubHeaders });
    const data = await res.json();
    
    // It's an object with keys "0", "1"...
    const poolList = Object.values(data).filter(p => p && p.Pubkey);
    
    console.log(`Found ${poolList.length} valid pools.`);
    
    // Search for keywords
    const keywords = ['Galang', 'Skyarina', 'Sugar Lea', 'Veryabd'];
    const found = poolList.filter(p => {
        const name = p.Name || '';
        return keywords.some(k => name.toLowerCase().includes(k.toLowerCase()));
    });

    console.log('Matches Found:', JSON.stringify(found, null, 2));

  } catch (err) {
    console.log('Error:', err.message);
  }
}

listPoolsCorrected();
