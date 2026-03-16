import fetch from 'node-fetch';

async function fetchHubPage() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  const url = `https://hub.accessprotocol.co/en/supporters/${address}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const text = await res.text();
    console.log('HTML Length:', text.length);
    
    // Look for indicators in HTML
    const foreverCount = (text.match(/Forever/g) || []).length;
    const redeemableCount = (text.match(/Redeemable/g) || []).length;
    
    console.log(`Forever indicators: ${foreverCount}`);
    console.log(`Redeemable indicators: ${redeemableCount}`);

    if (text.includes('__NEXT_DATA__')) {
        console.log('Found __NEXT_DATA__ payload!');
        const start = text.indexOf('__NEXT_DATA__') + 24;
        const end = text.indexOf('</script>', start);
        const json = text.slice(start, end);
        // console.log('JSON Snippet:', json.slice(0, 1000));
        if (json.includes('Forever') || json.includes('Redeemable')) {
            console.log('JSON contains type info!');
        }
    }

  } catch (err) {
    console.log('Error:', err.message);
  }
}

fetchHubPage();
