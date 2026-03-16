async function testAccessApiV2() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const urls = [
    `https://api.accessprotocol.co/v2/subscribers/${address}/subscriptions`,
    `https://api.accessprotocol.co/v1/subscribers/${address}/subscriptions`,
    `https://api.accessprotocol.co/holders/${address}/locked`,
    `https://hub-api.accessprotocol.co/v1/subscribers/${address}/stakes`
  ];

  for (const url of urls) {
    try {
      console.log(`\nTesting: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Referer': 'https://hub.accessprotocol.co/',
          'Accept': 'application/json'
        }
      });
      console.log(`Status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log('SUCCESS!');
        console.log('Data sample:', JSON.stringify(data, null, 2).slice(0, 1000));
        return;
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testAccessApiV2();
