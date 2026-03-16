async function testFinalAPIs() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const variants = [
    `https://go-api.accessprotocol.co/subscribers/${address}/locked`,
    `https://go-api.accessprotocol.co/subscribers/${address}/stakes`,
    `https://go-api.accessprotocol.co/users/${address}/locked`,
    `https://go-api.accessprotocol.co/users/${address}/stakes`,
    `https://go-api.accessprotocol.co/accounts/${address}/locked`
  ];

  for (const url of variants) {
    try {
      console.log(`Trying: ${url}`);
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
        console.log('Data:', JSON.stringify(data, null, 2).slice(0, 500));
        return;
      }
    } catch (err) {
      console.log(`Err: ${err.message}`);
    }
  }
}

testFinalAPIs();
