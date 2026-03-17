const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function investigate() {
  const wallet = 'CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn';
  const endpoints = [
    `https://go-api.accessprotocol.co/supporters/${wallet}`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/staking`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/pools`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/locked`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/redeemable`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/forever`,
    `https://api.accessprotocol.co/api/v1/supporters/${wallet}`,
    `https://api.accessprotocol.co/api/v1/supporters/${wallet}/locked`,
    `https://api.accessprotocol.co/api/v1/supporters/${wallet}/pools`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Referer': 'https://hub.accessprotocol.co/'
        }
      });
      console.log(`URL: ${url} -> Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`  Length: ${text.length}`);
        if (text.length > 0 && text.length < 2000) {
          try {
            const json = JSON.parse(text);
            console.log(`  Keys: ${Object.keys(json)}`);
            if (json.supporters) console.log(`  Supporters Array Length: ${json.supporters.length}`);
          } catch (e) {
            console.log(`  Text sample: ${text.slice(0, 50)}...`);
          }
        }
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
}

investigate();
