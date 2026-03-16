async function testHoldersAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://go-api.accessprotocol.co/holders/${address}/locked`;
  
  try {
    console.log(`Testing Holders API: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('SUCCESS!');
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('Body:', text.slice(0, 500));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testHoldersAPI();
