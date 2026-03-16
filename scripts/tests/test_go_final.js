async function testGoApiFinal() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const endpoints = [
    `https://go-api.accessprotocol.co/holders/${address}/locked`,
    `https://go-api.accessprotocol.co/subscribers/${address}/locked`,
    `https://go-api.accessprotocol.co/users/${address}/locked`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/locked`,
    `https://go-api.accessprotocol.co/v2/subscribers/${address}/locked`
  ];

  for (const url of endpoints) {
    try {
      console.log(`\nTesting: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Referer': 'https://hub.accessprotocol.co/'
        }
      });
      console.log(`Status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log('SUCCESS!');
        console.log('Data:', JSON.stringify(data, null, 2).slice(0, 1000));
        // If we found it, stop
        if (data.total_locked || data.amount || (data.supporters && data.supporters.length > 0)) {
           return;
        }
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testGoApiFinal();
