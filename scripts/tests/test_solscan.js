async function testSolscanAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://api-v2.solscan.io/account/nft?address=${address}&type=compressed`;
  
  try {
    console.log(`Testing Solscan API: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://solscan.io',
        'Referer': 'https://solscan.io/'
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Success!');
      console.log('Data sample:', JSON.stringify(data, null, 2).slice(0, 1000));
    } else {
      console.log('Fail:', response.status);
      const text = await response.text();
      console.log('Body:', text.slice(0, 200));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testSolscanAPI();
