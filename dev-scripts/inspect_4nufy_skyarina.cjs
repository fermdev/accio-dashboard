const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function inspectSupporter(poolPk, userAddress) {
  const url = `https://go-api.accessprotocol.co/supporters/${poolPk}/locked?per_page=1000`;
  console.log(`Inspecting ${userAddress} in ${poolPk}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
      }
    });
    
    if (res.ok) {
        const data = await res.json();
        const supporters = Array.isArray(data) ? data : (data.supporters || []);
        const supporter = supporters.find(s => s.pubkey === userAddress || s.address === userAddress);
        if (supporter) {
            console.log('FOUND!');
            console.log(JSON.stringify(supporter, null, 2));
        } else {
            console.log('Not found in this list.');
        }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

// User reference address, Skyarina pool
inspectSupporter('EBJRxsgYMLo55nvnQJdQPAf4jVUxb39rk2cFE7WT6gS5', '4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
