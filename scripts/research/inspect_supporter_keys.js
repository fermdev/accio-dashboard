async function inspectSupporterKeys() {
  const galangPool = 'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    const res = await fetch(`https://go-api.accessprotocol.co/supporters/${galangPool}/locked?per_page=1`, { headers: hubHeaders });
    const data = await res.json();
    const supporters = Array.isArray(data) ? data : (data.supporters || []);
    
    if (supporters.length > 0) {
        console.log('Sample Supporter Keys:', Object.keys(supporters[0]));
        console.log('Sample Data:', JSON.stringify(supporters[0], null, 2));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectSupporterKeys();
