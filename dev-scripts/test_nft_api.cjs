const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testNftEndpoint(poolPk) {
  const url = `https://go-api.accessprotocol.co/supporters/${poolPk}/nfts`;
  console.log(`Testing: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
      }
    });
    
    console.log(`Status: ${res.status}`);
    if (res.ok) {
        const data = await res.json();
        console.log('SUCCESS!');
        console.log(JSON.stringify(data, null, 2).slice(0, 1000));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

// Galang Ferm pool 
testNftEndpoint('o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97');
