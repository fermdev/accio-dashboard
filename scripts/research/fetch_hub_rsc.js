import fetch from 'node-fetch';

async function fetchHubRsc() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = `https://hub.accessprotocol.co/en/supporters/${address}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'Rsc': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const text = await res.text();
    console.log('RSC Length:', text.length);
    
    // Look for "Forever" or "Redeemable"
    const foreverMatches = text.match(/Forever/g);
    const redeemableMatches = text.match(/Redeemable/g);
    
    console.log('Forever Matches:', foreverMatches ? foreverMatches.length : 0);
    console.log('Redeemable Matches:', redeemableMatches ? redeemableMatches.length : 0);
    
    if (text.includes('Forever') || text.includes('Redeemable')) {
        console.log('Found type strings in RSC payload!');
        // Print some context
        const idx = text.indexOf('Forever');
        console.log('Context:', text.slice(idx - 50, idx + 50));
    }

  } catch (err) {
    console.log('Error:', err.message);
  }
}

fetchHubRsc();
