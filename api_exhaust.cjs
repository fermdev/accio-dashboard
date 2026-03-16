const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkEndpoints(wallet) {
  const types = ['locked', 'stakable', 'forever', 'redeemable'];
  console.log(`--- Checking Wallet: ${wallet} ---`);
  
  for (const type of types) {
    const url = `https://go-api.accessprotocol.co/supporters/${wallet}/${type}`;
    try {
      const res = await fetch(url, { headers: { 'Origin': 'https://hub.accessprotocol.co' } });
      const data = await res.json();
      const count = data.supporters?.length || data.items?.length || 0;
      console.log(`${type.toUpperCase()}: Status ${res.status}, Found ${count} items`);
      if (count > 0) {
        console.log(`  Sample:`, JSON.stringify(data.supporters?.[0] || data.items?.[0], null, 2));
      }
    } catch (e) {
      console.log(`${type.toUpperCase()} Error:`, e.message);
    }
  }

  console.log('\n--- Checking Global Stats for APY ---');
  const statsUrls = [
    'https://go-api.accessprotocol.co/stats',
    'https://go-api.accessprotocol.co/protocol'
  ];
  for (const url of statsUrls) {
    try {
      const res = await fetch(url, { headers: { 'Origin': 'https://hub.accessprotocol.co' } });
      const data = await res.json();
      console.log(`Stats ${url}:`, JSON.stringify(data, null, 2).slice(0, 500));
    } catch (e) {
      console.log(`Stats Error ${url}:`, e.message);
    }
  }
}

const WALLET = 'CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn';
checkEndpoints(WALLET);
