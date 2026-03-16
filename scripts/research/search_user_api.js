async function searchUserDirect() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  const urls = [
    `https://go-api.accessprotocol.co/search?query=${address}`,
    `https://go-api.accessprotocol.co/subscribers/${address}`,
    `https://go-api.accessprotocol.co/supporters/search?query=${address}`,
    `https://go-api.accessprotocol.co/users/search?query=${address}`
  ];

  for (const url of urls) {
    try {
      console.log(`Testing: ${url}`);
      const res = await fetch(url, { headers: hubHeaders });
      console.log(`Result: ${res.status}`);
      if (res.ok) {
          const data = await res.json();
          console.log('SUCCESS!');
          console.log('Data Sample:', JSON.stringify(data, null, 2).slice(0, 1000));
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

searchUserDirect();
