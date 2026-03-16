import fetch from 'node-fetch';

async function testGetApi() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  const endpoints = [
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/stakes`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/subscriptions`,
    `https://api.accessprotocol.co/v1/subscribers/${address}`,
    `https://api.accessprotocol.co/v2/subscribers/${address}/subscriptions`,
    `https://go-api.accessprotocol.co/holders/${address}/locked`
  ];

  for (const url of endpoints) {
    console.log(`Testing GET: ${url}`);
    try {
        const res = await fetch(url, { headers: hubHeaders });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Data (Sample):', JSON.stringify(data).slice(0, 1000));
            if (JSON.stringify(data).includes('Forever') || JSON.stringify(data).includes('Redeemable')) {
                console.log('FOUND TYPE INFO!');
            }
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
  }
}

testGetApi();
