import fetch from 'node-fetch';

async function testPostApi() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const endpoints = [
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/stakes`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/subscriptions`,
    `https://go-api.accessprotocol.co/holders/${address}/locked`
  ];

  for (const url of endpoints) {
    console.log(`Testing POST: ${url}`);
    try {
        const res = await fetch(url, { 
            method: 'POST',
            headers: hubHeaders,
            body: JSON.stringify({})
        });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Data:', JSON.stringify(data).slice(0, 1000));
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
  }
}

testPostApi();
