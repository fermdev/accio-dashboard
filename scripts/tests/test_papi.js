async function testPapi() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const endpoints = [
    `https://papi.accessprotocol.co/v2/subscribers/${address}/locked`,
    `https://papi.accessprotocol.co/v2/subscribers/${address}/stakes`,
    `https://papi.accessprotocol.co/v1/subscribers/${address}/locked`,
    `https://papi.accessprotocol.co/subscribers/${address}/locked`,
    `https://papi.accessprotocol.co/v2/users/${address}/locked`
  ];

  for (const url of endpoints) {
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
        console.log('Data:', JSON.stringify(data, null, 2).slice(0, 500));
        return;
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testPapi();
