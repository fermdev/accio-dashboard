async function findTargetPools() {
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    // Fetch 500 pools to be sure
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=500', { headers: hubHeaders });
    const data = await res.json();
    const poolList = Object.values(data).filter(p => p && p.Pubkey);
    
    console.log(`Searching ${poolList.length} pools...`);
    const keywords = ['Galang', 'Skyarina', 'Sugar Lea', 'Veryabd'];
    const targets = poolList.filter(p => {
        const name = p.Name || '';
        return keywords.some(k => name.toLowerCase().includes(k.toLowerCase()));
    });

    console.log('--- TARGET POOLS FOUND ---');
    targets.forEach(p => {
        console.log(`Name: ${p.Name}, Pubkey: ${p.Pubkey}`);
    });

  } catch (err) {
    console.log('Error:', err.message);
  }
}

findTargetPools();
