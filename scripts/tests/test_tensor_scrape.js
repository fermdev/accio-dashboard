async function testTensorScrape() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://www.tensor.trade/portfolio?wallet=${address}`;
  
  try {
    console.log(`Testing Tensor Scrape: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log('Body length:', text.length);
    if (text.includes('Access')) {
       console.log('FOUND ACCESS IN TENSOR SCRAPE!');
    }
    console.log('Body sample:', text.slice(0, 1000));
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testTensorScrape();
