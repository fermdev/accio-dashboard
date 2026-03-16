const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function inspectLockedApi(poolPk, userAddress) {
  const url = `https://go-api.accessprotocol.co/supporters/${poolPk}/locked?per_page=1000`;
  console.log(`Inspecting: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'Accept': 'application/json'
      }
    });
    
    if (res.ok) {
        const data = await res.json();
        const supporters = Array.isArray(data) ? data : (data.supporters || []);
        const supporter = supporters.find(s => s.pubkey === userAddress || s.address === userAddress);
        
        if (supporter) {
            console.log('SUPPORTER FOUND. DATA:');
            console.log(JSON.stringify(supporter, null, 2));
        } else {
            console.log('User not found in this pool list.');
            // Print first supporter for structure inspection
            if (supporters.length > 0) {
                console.log('Sample supporter structure:');
                console.log(JSON.stringify(supporters[0], null, 2));
            }
        }
    } else {
        console.log(`Status: ${res.status}`);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

// Target Pool: Galang Ferm
inspectLockedApi('o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97', 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
