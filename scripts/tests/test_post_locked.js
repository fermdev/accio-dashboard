async function testPostLocked() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const urls = [
    `https://go-api.accessprotocol.co/holders/${address}/locked`,
    `https://go-api.accessprotocol.co/subscribers/${address}/locked`,
    `https://go-api.accessprotocol.co/v1/subscribers/${address}/locked`
  ];

  for (const url of urls) {
    try {
      console.log(`Testing POST: ${url}`);
      const res = await fetch(url, { 
        method: 'POST', 
        headers: hubHeaders,
        body: JSON.stringify({}) // empty body or something
      });
      console.log(`Result: ${res.status}`);
      if (res.ok) {
          const data = await res.json();
          console.log('SUCCESS POST!');
          console.log(JSON.stringify(data, null, 2).slice(0, 500));
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

testPostLocked();
