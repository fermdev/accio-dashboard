const fetch = require('node-fetch');

async function check() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const types = ['locked', 'forever', 'redeemable'];
  
  for (const t of types) {
    const url = `https://go-api.accessprotocol.co/supporters/${wallet}/${t}`;
    console.log(`Checking ${t}: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Referer': 'https://hub.accessprotocol.co/'
        }
      });
      console.log(`Status: ${res.status}`);
      const data = await res.json();
      console.log(`Total Staked: ${data.total || data.total_staked || 0}`);
      if (data.supporters_count || data.stakers) {
          console.log(`Pools: ${data.supporters_count || (data.stakers ? data.stakers.length : 0)}`);
          if (data.stakers) data.stakers.forEach(s => console.log(` - ${s.pool_name || s.pool_address}`));
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
    console.log('---');
  }
}

check();
