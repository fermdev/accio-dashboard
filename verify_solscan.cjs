const fetch = require('node-fetch');

async function test() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://api.solscan.io/account/tokens?address=${wallet}`;
  
  console.log('Testing Solscan Tokens API...');
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Result count:', data.data?.length || 0);
    // Search for ACS in the tokens
    const acs = data.data?.filter(t => t.tokenSymbol === 'ACS' || t.tokenName?.includes('Access'));
    console.log('ACS tokens found:', acs?.length || 0);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
