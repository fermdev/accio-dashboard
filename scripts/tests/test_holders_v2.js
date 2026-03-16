import fetch from 'node-fetch';

async function testHoldersApi() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  const endpoints = [
    `https://go-api.accessprotocol.co/holders/${address}/locked`,
    `https://go-api.accessprotocol.co/subscribers/${address}/locked`,
    `https://go-api.accessprotocol.co/v1/holders/${address}/locked`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/locked`
  ];

  for (const url of endpoints) {
    console.log(`Testing: ${url}`);
    try {
        const res = await fetch(url, { headers: hubHeaders });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Data (Sample):', JSON.stringify(data).slice(0, 500));
            if (JSON.stringify(data).includes('Forever') || JSON.stringify(data).includes('type')) {
                console.log('FOUND POTENTIAL MATCH!');
            }
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
  }
}

testHoldersApi();
