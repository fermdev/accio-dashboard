const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSupporterPools(userAddress) {
  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  const urls = [
    `${HUB_API_BASE}/supporters/${userAddress}/pools`,
    `${HUB_API_BASE}/v2/subscribers/${userAddress}/subscriptions`,
    `${HUB_API_BASE}/v1/supporters/${userAddress}`
  ];
  
  for (const url of urls) {
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
            console.log(JSON.stringify(data).slice(0, 500));
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
  }
}

testSupporterPools('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREjPkn6');
