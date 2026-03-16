async function inspectSupporterAddresses() {
  const galangPool = 'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    console.log(`Fetching supporters for pool: ${galangPool}`);
    const res = await fetch(`https://go-api.accessprotocol.co/supporters/${galangPool}/locked?per_page=50`, { headers: hubHeaders });
    const data = await res.json();
    const supporters = Array.isArray(data) ? data : (data.supporters || []);
    
    console.log(`Found ${supporters.length} supporters.`);
    if (supporters.length > 0) {
        console.log('Sample Addresses:');
        supporters.slice(0, 10).forEach((s, i) => {
            console.log(`${i}: ${s.address} (${s.amount})`);
        });
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectSupporterAddresses();
