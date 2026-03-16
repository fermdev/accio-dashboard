async function testMagicEden() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://api-mainnet.magiceden.dev/v2/wallets/${address}/tokens?limit=100`;
  
  try {
    console.log(`Testing Magic Eden: ${url}`);
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('SUCCESS!');
      console.log('Data sample:', JSON.stringify(data, null, 2).slice(0, 1000));
    } else {
      const text = await response.text();
      console.log('Body:', text.slice(0, 500));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testMagicEden();
