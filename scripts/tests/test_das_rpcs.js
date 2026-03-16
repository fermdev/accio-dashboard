import fetch from 'node-fetch';

async function testDasRpcs() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  const rpcs = [
    'https://api.mainnet-beta.solana.com',
    'https://rpc.ankr.com/solana',
    'https://solana-mainnet.g.allthatnode.com/full/evm', // Probably not this
    'https://mainnet.helius-rpc.com/?api-key=f6f4d5b2-3e2b-4b1a-9c1a-1a2b3c4d5e6f', // Dummy key just in case
    'https://patient-dry-morning.solana-mainnet.quiknode.pro/8e33.../', // Dummy
    'https://rpc.accessprotocol.co'
  ];

  for (const rpc of rpcs) {
    console.log(`Testing RPC: ${rpc}`);
    try {
      const res = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'test',
          method: 'getAssetsByOwner',
          params: {
            ownerAddress: address,
            page: 1,
            limit: 10
          }
        })
      });

      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
            console.log(`Found ${data.result.items?.length || 0} assets!`);
            if (data.result.items?.length > 0) {
                console.log('Sample Asset Metadata:', JSON.stringify(data.result.items[0].content?.metadata, null, 2));
                return; // Found one!
            }
        } else {
            console.log('No result in response.');
        }
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testDasRpcs();
