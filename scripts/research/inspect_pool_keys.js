async function inspectPoolKeys() {
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    const res = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=1', { headers: hubHeaders });
    const data = await res.json();
    const firstPool = Object.values(data).find(p => p && p.Pubkey);
    if (firstPool) {
        // Log all keys joined by comma to avoid truncation
        console.log('Pool Keys:', Object.keys(firstPool).join(', '));
        // Log a few important values
        console.log('Name:', firstPool.Name);
        console.log('Supporters:', firstPool.Supporters);
        console.log('TotalLocked:', firstPool.TotalLocked);
        console.log('StakersPart:', firstPool.StakersPart);
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectPoolKeys();
