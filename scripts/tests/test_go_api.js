async function testGoAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://go-api.accessprotocol.co/supporters/${address}/locked`;
  
  try {
    console.log(`Testing Go API: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Success!');
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      console.log('Fail:', response.status);
      const text = await response.text();
      console.log('Body:', text);
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testGoAPI();
