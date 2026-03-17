const fetch = require('node-fetch');

async function test() {
  const wallet = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const rpcBody = {
    jsonrpc: '2.0',
    id: 'test',
    method: 'getAssetsByOwner',
    params: { ownerAddress: wallet, page: 1, limit: 10 }
  };

  const URL = 'https://accessprotocol.rpcpool.com/';
  
  console.log('Testing Triton Primary Backend...');
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'https://hub.accessprotocol.co'
      },
      body: JSON.stringify(rpcBody)
    });

    console.log('Status:', res.status);
    const data = await res.json();
    if (data.result && data.result.items) {
      console.log('SUCCESS! Found', data.result.items.length, 'items');
      const acs = data.result.items.filter(item => {
          const name = item.content?.metadata?.name || '';
          return name.includes('Access') || (item.content?.metadata?.symbol === 'ACS');
      });
      console.log('Access Items found:', acs.length);
      if (acs.length > 0) {
          console.log('Sample Name:', acs[0].content.metadata.name);
          const amt = acs[0].content.metadata.attributes?.find(a => a.trait_type === 'Amount')?.value;
          console.log('Sample Amount:', amt);
      }
    } else {
      console.log('No result. Reason:', data.error || 'Empty');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
