const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function investigate() {
  const w = 'CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn';
  const endpoints = [
    `https://go-api.accessprotocol.co/supporters/${w}/staking`,
    `https://go-api.accessprotocol.co/supporters/${w}/portfolio`,
    `https://go-api.accessprotocol.co/api/v1/supporters/${w}/staking`,
    `https://api.accessprotocol.co/api/v1/supporters/${w}/staking`,
    `https://go-api.accessprotocol.co/supporters/locked?user_pubkey=${w}`,
    `https://go-api.accessprotocol.co/supporters/locked?supporter_pubkey=${w}`,
    `https://api.accessprotocol.co/api/v1/supporters/locked?user_pubkey=${w}`
  ];

  const headers = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers });
      console.log(`URL: ${url} -> Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`  Body: ${text.slice(0, 500)}...`);
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
}

investigate();
