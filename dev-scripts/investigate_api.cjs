const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function investigate() {
  const supporterUrl = 'https://go-api.accessprotocol.co/supporters/CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn/locked';
  const poolsUrl = 'https://go-api.accessprotocol.co/pools?per_page=1';
  
  console.log('--- Checking Supporter Pools ---');
  try {
    const res = await fetch(supporterUrl, {
      headers: { 'Origin': 'https://hub.accessprotocol.co' }
    });
    const data = await res.json();
    console.log('Supporter Data Sample:', JSON.stringify(data.supporters?.[0] || data, null, 2));
    console.log('Total Pools:', data.supporters?.length || 0);
  } catch (e) {
    console.error('Supporter API Error:', e.message);
  }

  console.log('\n--- Checking Global Pools/APY ---');
  try {
    const res = await fetch(poolsUrl, {
      headers: { 'Origin': 'https://hub.accessprotocol.co' }
    });
    const data = await res.json();
    console.log('Pool Info Sample:', JSON.stringify(data.pools?.[0] || data, null, 2));
  } catch (e) {
    console.error('Pools API Error:', e.message);
  }
}

investigate();
