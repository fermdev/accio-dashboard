async function testRscScrape() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  // Attempt to hit the subscription page RSC
  const url = `https://hub.accessprotocol.co/en/subscriptions?_rsc=15bfb`; // Hash might need to be dynamic but let's try
  
  try {
    console.log(`Testing RSC Scrape: ${url}`);
    const response = await fetch(url, {
      headers: {
        'Accept': '*/*',
        'Rsc': '1',
        'Next-Router-State-Tree': '%5B%22%22%2C%7B%22children%22%3B%5B%22en%22%2C%7B%22children%22%3B%5B%22subscriptions%22%2C%7B%22children%22%3B%5B%22__PAGE__%22%2C%7B%7D%5D%7D%5D%7D%5D%7D%5D',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      }
    });
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log('Body length:', text.length);
    if (text.includes('Galang')) {
       console.log('FOUND GALANG IN RSC!');
    }
    if (text.includes('635')) {
       console.log('FOUND 635 IN RSC!');
    }
    console.log('Body sample:', text.slice(0, 1000));
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testRscScrape();
