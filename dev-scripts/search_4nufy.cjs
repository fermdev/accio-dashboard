const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function searchUser(userAddress) {
  const url = `https://go-api.accessprotocol.co/search?query=${userAddress}`;
  console.log(`Searching: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
      }
    });
    
    if (res.ok) {
        const data = await res.json();
        console.log('SEARCH RESULT:');
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log(`Status: ${res.status}`);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

searchUser('4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
