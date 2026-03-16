async function testMetadataAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://metadata.accessprotocol.co/v1/subscribers/${address}`;
  
  try {
    console.log(`Testing Metadata API: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Success!');
      console.log('Data sample:', JSON.stringify(data, null, 2).slice(0, 1000));
    } else {
      console.log('Fail:', response.status);
      const text = await response.text();
      console.log('Body:', text.slice(0, 500));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testMetadataAPI();
