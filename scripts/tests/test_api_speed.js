import fetch from 'node-fetch';

async function testApiEndpoint() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://api.accessprotocol.co/v1/subscribers/${address}/subscriptions`;
  
  try {
    console.log(`Testing: ${url}`);
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });
    
    console.log(`Status: ${res.status}`);
    if (res.ok) {
        const data = await res.json();
        console.log('SUCCESS!');
        console.log(JSON.stringify(data, null, 2).slice(0, 1000));
    } else {
        const text = await res.text();
        console.log('Response text:', text.slice(0, 100));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testApiEndpoint();
