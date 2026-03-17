const fetch = require('node-fetch');

async function test() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const endpoints = [
    `https://go-api.accessprotocol.co/supporters/${wallet}`,
    `https://go-api.accessprotocol.co/subscribers/${wallet}`,
    `https://go-api.accessprotocol.co/users/${wallet}/subscriptions`,
    `https://go-api.accessprotocol.co/supporters/all?user_pubkey=${wallet}`
  ];
  
  for (const url of endpoints) {
    console.log(`Testing: ${url}`);
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
        console.log('Success! Keys found:', Object.keys(data));
        console.log('Total:', data.total || data.total_staked || 'unknown');
        return;
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

test();
