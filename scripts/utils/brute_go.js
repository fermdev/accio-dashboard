async function bruteForceGoApi() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  const paths = [
    `/holders/${address}/locked`,
    `/holders/${address}/stakes`,
    `/subscribers/${address}/locked`,
    `/subscribers/${address}/stakes`,
    `/subscribers/${address}/subscriptions`,
    `/users/${address}/locked`,
    `/users/${address}/stakes`,
    `/users/${address}/subscriptions`,
    `/v1/holders/${address}/locked`,
    `/v1/subscribers/${address}/locked`,
    `/v2/holders/${address}/locked`,
    `/v2/subscribers/${address}/locked`
  ];

  for (const path of paths) {
    const url = `https://go-api.accessprotocol.co${path}`;
    try {
      // Try GET
      let res = await fetch(url, { method: 'GET', headers: hubHeaders });
      console.log(`GET ${path} -> ${res.status}`);
      if (res.ok) {
        console.log(`SUCCESS GET ${path}!`);
        return;
      }

      // Try POST
      res = await fetch(url, { method: 'POST', headers: hubHeaders });
      console.log(`POST ${path} -> ${res.status}`);
      if (res.ok) {
        console.log(`SUCCESS POST ${path}!`);
        return;
      }
    } catch (e) {
      console.log(`Error ${path}: ${e.message}`);
    }
  }
}

bruteForceGoApi();
