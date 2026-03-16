async function testAccessAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  // Try several variants found in logs/search
  const urls = [
    `https://api.accessprotocol.co/v2/subscribers/${address}/subscriptions`,
    `https://api.accessprotocol.co/v1/subscribers/${address}/subscriptions`,
    `https://api.accessprotocol.co/v1/subscribers/${address}/stakes`
  ];

  for (const url of urls) {
    try {
      console.log(`Testing API: ${url}`);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(`Success! ${url}`);
        console.log('Sample data:', JSON.stringify(data, null, 2).slice(0, 500));
        return;
      } else {
        console.log(`Fail: ${url} (status ${response.status})`);
      }
    } catch (err) {
      console.log(`Error: ${url} (${err.message})`);
    }
  }
}

testAccessAPI();
