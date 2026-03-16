import fetch from 'node-fetch';

async function researchTypes() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  // Check if there is a 'subscriptions' endpoint
  const testUrls = [
    `https://go-api.accessprotocol.co/subscribers/${address}/subscriptions`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/subscriptions`,
    `https://api.accessprotocol.co/v1/subscribers/${address}/subscriptions`,
  ];

  for (const url of testUrls) {
    console.log(`Testing URL: ${url}`);
    try {
        const res = await fetch(url, { headers: hubHeaders });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Data Snippet:', JSON.stringify(data).slice(0, 500));
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
  }
}

researchTypes();
