async function testGoApiPost() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://go-api.accessprotocol.co/holders/${address}/locked`;
  
  try {
    console.log(`Testing Go API (POST): ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // Empty body or check if it needs params
    });
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log('Body:', text.slice(0, 1000));
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testGoApiPost();
