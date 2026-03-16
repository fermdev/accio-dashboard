import fetch from 'node-fetch';

async function inspectPools() {
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=10', { headers: hubHeaders });
    const data = await res.json();
    console.log('Pool Object (Sample):', JSON.stringify(Object.values(data)[0], null, 2));
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectPools();
