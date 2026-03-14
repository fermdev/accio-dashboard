
import { Connection, PublicKey } from '@solana/web3.js';
import fetch from 'node-fetch';

const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana.publicnode.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.rpc.extrnode.com',
  'https://solana-api.projectserum.com',
  'https://api.witness.co/solana/mainnet'
];

const poolAddress = '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi';

async function testRace() {
    const pubkey = new PublicKey(poolAddress);
    const start = Date.now();
    
    console.log('Starting RPC Race...');
    
    const controllers = RPC_ENDPOINTS.map(() => new AbortController());
    
    const fetchPromises = RPC_ENDPOINTS.map(async (endpoint, index) => {
      const eStart = Date.now();
      try {
        const connection = new Connection(endpoint, {
          commitment: 'confirmed',
          fetch: (url, options) => fetch(url, { ...options, signal: controllers[index].signal })
        });
        const info = await connection.getAccountInfo(pubkey);
        if (info) {
          const duration = Date.now() - eStart;
          console.log(`✅ ${endpoint} won in ${duration}ms`);
          controllers.forEach((c, i) => { if (i !== index) c.abort(); });
          return info;
        }
        throw new Error('Not found');
      } catch (e) {
        if (e.name !== 'AbortError') {
            console.log(`❌ ${endpoint} failed: ${e.message}`);
        }
        throw e;
      }
    });

    try {
      const result = await Promise.any(fetchPromises);
      console.log(`Total Race Duration: ${Date.now() - start}ms`);
      return result;
    } catch (e) {
      console.error('All RPCs failed');
    }
}

testRace();
