async function testHubAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://hub-api.accessprotocol.co/subscribers/${address}/stakes`;
  
  try {
    console.log(`Testing Hub API: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.log('API responded with error:', response.status);
      const text = await response.text();
      console.log('Response body:', text);
      return;
    }
    const data = await response.json();
    console.log('Success! Data structure:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

testHubAPI();
