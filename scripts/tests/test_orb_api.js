async function testOrbAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  // Attempt to find the correct Orb API endpoint based on the URL provided
  const url = `https://orb-api.com/solana/v1/address/${address}/nfts?limit=100`;
  
  try {
    console.log(`Testing Orb API: ${url}`);
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log('SUCCESS!');
      console.log('Data:', JSON.stringify(data, null, 2).slice(0, 1000));
    } else {
      const text = await response.text();
      console.log('Body:', text.slice(0, 500));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testOrbAPI();
