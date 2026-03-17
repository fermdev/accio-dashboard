const fetch = require('node-fetch');

async function test() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://api.solanahub.app/v1/user/${wallet}/compressed-nfts`;
  
  console.log('Testing Solana Hub User API...');
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    console.log('Status:', res.status);
    const data = await res.json();
    if (data.nfts) {
      console.log('Found', data.nfts.length, 'nfts');
    } else {
      console.log('Data keys:', Object.keys(data));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
