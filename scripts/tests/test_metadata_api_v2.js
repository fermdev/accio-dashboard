import fetch from 'node-fetch';

async function testMetadataApi() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  // Attempt to find metadata for this user
  const url = `https://metadata.accessprotocol.co/v1/subscribers/${address}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'Accept': 'application/json'
      }
    });
    
    console.log('Status:', res.status);
    if (res.ok) {
        const data = await res.json();
        console.log('Metadata Data:', JSON.stringify(data, null, 2));
    } else {
        console.log('Error text:', await res.text());
    }

  } catch (err) {
    console.log('Error:', err.message);
  }
}

testMetadataApi();
