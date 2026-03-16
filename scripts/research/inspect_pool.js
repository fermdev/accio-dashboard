async function inspectPoolStructure() {
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=10', { headers: hubHeaders });
    const data = await res.json();
    console.log('API Keys:', Object.keys(data));
    
    // If it's an array directly
    if (Array.isArray(data)) {
        console.log('Sample Pool (Array):', JSON.stringify(data[0], null, 2));
    } else {
        // If it's an object with a data/pools key
        const list = data.pools || data.data || [];
        if (list.length > 0) {
            console.log('Sample Pool (Object):', JSON.stringify(list[0], null, 2));
        } else {
            console.log('No pools found in object. Full data head:', JSON.stringify(data).slice(0, 500));
        }
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectPoolStructure();
