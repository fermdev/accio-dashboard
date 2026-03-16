async function fetchHubProfileHtml() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://hub.accessprotocol.co/en/supporters/${address}`;
  
  try {
    console.log(`Fetching Hub Profile: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    
    console.log(`Status: ${response.status}`);
    const html = await response.text();
    console.log('HTML Length:', html.length);
    
    if (html.includes('635')) {
       console.log('FOUND 635 IN HTML!');
       // Find the context
       const index = html.indexOf('635');
       console.log('Context:', html.slice(index - 50, index + 50));
    } else {
       console.log('Did not find 635 in HTML.');
    }
    
    if (html.includes('Galang')) {
       console.log('FOUND GALANG IN HTML!');
    }

    // Check for any embedded JSON state
    if (html.includes('props')) {
       console.log('Found "props" in HTML.');
    }

    console.log('HTML Body (start):', html.slice(0, 500));
  } catch (err) {
    console.log('Error:', err.message);
  }
}

fetchHubProfileHtml();
