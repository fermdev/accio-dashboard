import { Connection } from '@solana/web3.js';

const RPC = 'https://rpc.ankr.com/solana';
const WALLET = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';

async function testDAS() {
  const connection = new Connection(RPC);
  try {
    console.log('Testing DAS getAssetsByOwner...');
    const response = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'test',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: WALLET,
          page: 1,
          limit: 100
        },
      }),
    });
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

testDAS();
