import fetch from 'node-fetch';

async function testV2Api() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  const urls = [
    `https://go-api.accessprotocol.co/v2/subscribers/${address}/stakes`,
    `https://go-api.accessprotocol.co/v2/subscribers/${address}/subscriptions`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/stakes`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/subscriptions`
  ];

  for (const url of urls) {
    console.log(`Testing: ${url}`);
    try {
        const res = await fetch(url, { headers: hubHeaders });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Length:', Array.isArray(data) ? data.length : 'N/A');
            console.log('Sample:', JSON.stringify(data).slice(0, 500));
        }
    } catch (err) {
        console.log('Error:', err.message);
    }
  }
}

testV2Api();
