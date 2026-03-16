async function testWrpcFinal() {
  const RPC = 'https://wrpc.accessprotocol.co';
  const WALLET = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

  try {
    console.log(`Testing WRPC (Final Emulation): ${RPC}`);
    const response = await fetch(RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '1',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: WALLET,
          page: 1,
          limit: 100,
          displayOptions: {
            showCollectionMetadata: true
          }
        },
      }),
    });
    
    console.log(`Status: ${response.status}`);
    const text = await response.text();
    console.log('Body (slice):', text.slice(0, 1000));
    
    try {
      const data = JSON.parse(text);
      if (data.result) {
        console.log('TOTAL ASSETS:', data.result.total);
        if (data.result.items.length > 0) {
           console.log('SAMPLE ITEM:', JSON.stringify(data.result.items[0], null, 2));
        }
      }
    } catch (e) {
      console.log('Failed to parse JSON.');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

testWrpcFinal();
