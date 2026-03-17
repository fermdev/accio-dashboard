const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugCnfts() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const url = 'https://wrpc.accessprotocol.co/';
  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: wallet,
          page: 1,
          limit: 100
        }
      })
    });

    const data = await res.json();
    const items = data.result?.items || [];
    
    console.log(`Found ${items.length} items.`);
    
    items.forEach((item, i) => {
      const metadata = item.content?.metadata;
      const attributes = metadata?.attributes || [];
      console.log(`\nItem ${i+1}: ${metadata?.name} (Symbol: ${metadata?.symbol})`);
      console.log('Attributes:', JSON.stringify(attributes, null, 2));
    });

  } catch (err) {
    console.error('Error:', err.message);
  }
}

debugCnfts();
