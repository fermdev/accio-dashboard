const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUserEndpoints(userAddress) {
  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  const endpoints = [
    `/v1/subscriber/${userAddress}`,
    `/v2/subscriber/${userAddress}`,
    `/subscriber/${userAddress}`,
    `/supporters/${userAddress}`,
    `/v1/supporters/${userAddress}`
  ];
  
  for (const end of endpoints) {
    const url = HUB_API_BASE + end;
    console.log(`Testing: ${url}`);
    try {
        const res = await fetch(url, {
            headers: {
                'Origin': 'https://hub.accessprotocol.co',
                'Referer': 'https://hub.accessprotocol.co/',
                'Accept': 'application/json'
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
}

testUserEndpoints('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
