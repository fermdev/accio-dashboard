async function testSpecificSubscriberAPI() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://api.accessprotocol.co/v1/subscribers/${address}`;
  
  try {
    console.log(`Testing Specific API: ${url}`);
    const response = await fetch(url, {
      redirect: 'follow', // Explicitly follow redirects
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      }
    });
    console.log(`Status: ${response.status}`);
    console.log(`Redirected to: ${response.url}`);
    
    const text = await response.text();
    console.log('Response body (peek):', text.slice(0, 500));
    
    try {
      const data = JSON.parse(text);
      console.log('Parsed JSON Success!');
    } catch (e) {
      console.log('Failed to parse as JSON (likely HTML or other)');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testSpecificSubscriberAPI();
