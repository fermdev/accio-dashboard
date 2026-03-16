async function scrapeOrbMarkets() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://orbmarkets.io/address/${address}/nfts`;
  
  try {
    console.log(`Scraping Orb Markets: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    });
    
    console.log(`Status: ${response.status}`);
    const html = await response.text();
    console.log('HTML Length:', html.length);
    
    // Look for fingerprints of Access NFTs
    if (html.includes('7qbSm8mJSmnZX5c18RF4o7yCdeAkyKVcgCR8geTRSexT')) {
       console.log('Found Access Collection Mint in HTML!');
    }
    
    // Look for JSON state often embedded in modern apps
    if (html.includes('__NEXT_DATA__')) {
       console.log('Found NEXT_DATA in HTML!');
       // Try to extract it
       const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
       if (match) {
          console.log('Extracted NEXT_DATA!');
          // The data might be very large, just log keys
          const json = JSON.parse(match[1]);
          console.log('JSON Keys:', Object.keys(json));
       }
    }

    console.log('HTML Sample:', html.slice(0, 500));
  } catch (err) {
    console.log('Error:', err.message);
  }
}

scrapeOrbMarkets();
