const fetch = require('node-fetch');

async function test() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const type = 'forever';
  const url = `https://go-api.accessprotocol.co/supporters/${wallet}/${type}`;
  
  console.log('Testing Hub API:', url);
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Keys:', Object.keys(data));
    console.log('Full data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
