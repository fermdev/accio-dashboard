const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function investigate() {
  const wallets = [
    'CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn',
    'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6'
  ];

  const patterns = [
    'https://go-api.accessprotocol.co/supporters/{w}/staking-info',
    'https://go-api.accessprotocol.co/supporters/{w}/locked',
    'https://go-api.accessprotocol.co/supporters/staking-summary/{w}',
    'https://go-api.accessprotocol.co/api/v1/supporters/{w}/staking-info',
    'https://api.accessprotocol.co/api/v1/supporters/{w}/staking-info'
  ];

  const headers = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json, text/plain, */*'
  };

  for (const w of wallets) {
    console.log(`\n=== Wallet: ${w} ===`);
    for (const p of patterns) {
      const url = p.replace('{w}', w);
      try {
        const res = await fetch(url, { headers });
        console.log(`URL: ${url} -> Status: ${res.status}`);
        if (res.ok) {
          const text = await res.text();
          if (text.length > 0) {
            try {
              const json = JSON.parse(text);
              console.log(`  Data: ${JSON.stringify(json).slice(0, 500)}...`);
            } catch (e) {
              console.log(`  Invalid JSON: ${text.slice(0, 100)}...`);
            }
          } else {
            console.log(`  Empty Body`);
          }
        }
      } catch (e) {
        console.log(`  Error: ${e.message}`);
      }
    }
  }
}

investigate();
