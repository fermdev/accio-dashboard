const fetch = require('node-fetch');

async function testMainnet() {
  const URL = 'https://api.mainnet-beta.solana.com';
  console.log('Testing DAS against', URL);

  const rpcBody = {
    jsonrpc: '2.0',
    id: 'test',
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6',
      page: 1,
      limit: 1000
    }
  };

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody)
    });
    
    if (res.ok) {
        const data = await res.json();
        const items = data.result?.items || [];
        console.log(`Success! Found ${items.length} assets.`);
        let foundAcs = 0;
        
        items.forEach(item => {
            const attrs = item.content?.metadata?.attributes || item.metadata?.attributes || item.attributes || [];
            
            // Just print any asset that has an "Amount" trait or "Access" in name
            const name = item.content?.metadata?.name || '';
            const symbol = item.content?.metadata?.symbol || '';
            
            const amountAttr = attrs.find(a => String(a.trait_type).toLowerCase().includes('amount'));
            const isAccess = name.includes('Access') || symbol === 'ACS' || amountAttr;
            
            if (isAccess) {
                console.log(`\nFound matching asset: ${name} (${symbol})`);
                console.log('Attributes:');
                attrs.forEach(a => console.log(`  - ${a.trait_type}: ${a.value}`));
                if (amountAttr) {
                  const cleanAmt = String(amountAttr.value).split(' ')[0].replace(/,/g, '');
                  foundAcs += parseFloat(cleanAmt) || 0;
                }
            }
        });
        console.log(`\nTotal ACS found in cNFTs: ${foundAcs}`);
    } else {
        console.log('Error output:', await res.text());
    }
  } catch (err) {
    console.log('Exception:', err.message);
  }
}

testMainnet();
