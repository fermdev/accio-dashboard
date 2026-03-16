async function testSupporterFilter() {
  const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const galangPool = 'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97'; // Galang Ferm
  
  // Try several filter patterns
  const variants = [
    `https://go-api.accessprotocol.co/supporters/${galangPool}/locked?address=${user}`,
    `https://go-api.accessprotocol.co/supporters/${galangPool}/locked?user=${user}`,
    `https://go-api.accessprotocol.co/supporters/${galangPool}/locked?owner=${user}`,
    `https://go-api.accessprotocol.co/supporters/${galangPool}/locked?search=${user}`
  ];

  for (const url of variants) {
    try {
      console.log(`\nTesting Filter: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Referer': 'https://hub.accessprotocol.co/'
        }
      });
      console.log(`Status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log('SUCCESS!');
        // Look for the user in the response
        console.log('Result length:', data.supporters ? data.supporters.length : 'N/A');
        if (data.supporters && data.supporters.length > 0) {
           console.log('Sample Supporter:', JSON.stringify(data.supporters[0], null, 2));
           // If it's a filtered list, it should be small
           if (data.supporters.length < 10) {
              console.log('FILTER WORKS!');
              return;
           }
        }
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }
}

testSupporterFilter();
