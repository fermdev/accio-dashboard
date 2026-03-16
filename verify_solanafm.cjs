const fetch = require('node-fetch');

async function test() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://api.solana.fm/v0/accounts/${wallet}/compressed-assets`;
  
  console.log('Testing Solana.fm Compressed Assets API...');
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Result type:', typeof data.result);
    // Log first few items to see structure
    if (data.result && Array.isArray(data.result)) {
      console.log('Found', data.result.length, 'cNFTs');
      data.result.slice(0, 2).forEach(item => {
        console.log('Item:', item.metadata?.name, 'Attributes:', item.metadata?.attributes?.length);
      });
    } else {
      console.log('Response:', JSON.stringify(data).slice(0, 200));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
