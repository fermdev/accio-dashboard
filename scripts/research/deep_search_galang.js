async function findUserInSupportersDetailed() {
  const galangPool = 'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97';
  const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    console.log(`Deep searching supporters for Galang Ferm pool...`);
    const res = await fetch(`https://go-api.accessprotocol.co/supporters/${galangPool}/locked?per_page=1000`, { headers: hubHeaders });
    const data = await res.json();
    const supporters = Array.isArray(data) ? data : (data.supporters || []);
    
    console.log(`Checking ${supporters.length} supporters...`);
    let found = false;
    supporters.forEach((s, i) => {
        const str = JSON.stringify(s);
        if (str.includes(user)) {
            console.log(`[!] FOUND MATCH AT INDEX ${i}:`, JSON.stringify(s, null, 2));
            found = true;
        }
    });
    
    if (!found) {
        console.log('No match found for wallet address in the supporters list.');
        // Log one sample just to be sure about the keys again
        console.log('Sample Supporter:', JSON.stringify(supporters[0], null, 2));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

findUserInSupportersDetailed();
