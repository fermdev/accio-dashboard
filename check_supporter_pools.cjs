const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkSupporterPools(wallet) {
  const url = `https://go-api.accessprotocol.co/supporters/${wallet}/locked`;
  console.log(`Checking: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });
    
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Response not OK');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

checkSupporterPools('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
