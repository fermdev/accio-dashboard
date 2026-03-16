async function testSpecificSubpaths() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  const subpaths = [
    'subscriptions',
    'pools',
    'stakes',
    'locked',
    'accounts'
  ];

  const prefixes = [
    `/holders/${address}`,
    `/subscribers/${address}`,
    `/users/${address}`
  ];

  for (const prefix of prefixes) {
    for (const sub of subpaths) {
        const url = `https://go-api.accessprotocol.co${prefix}/${sub}`;
        try {
            const res = await fetch(url, { headers: hubHeaders });
            console.log(`GET ${url} -> ${res.status}`);
            if (res.ok) {
                console.log('!!! SUCCESS !!!');
                const data = await res.json();
                console.log(JSON.stringify(data, null, 2).slice(0, 500));
                return;
            }
        } catch (e) {
            console.log(`Error ${url}: ${e.message}`);
        }
    }
  }
}

testSpecificSubpaths();
