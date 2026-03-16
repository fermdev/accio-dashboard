import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const HUB_API_BASE = 'https://go-api.accessprotocol.co';
const HUB_HEADERS = {
  'Origin': 'https://hub.accessprotocol.co',
  'Referer': 'https://hub.accessprotocol.co/',
  'Accept': 'application/json'
};

// Public DAS RPCs to try sequentially from the client
const PUBLIC_DAS_RPCS = [
  'https://wrpc.accessprotocol.co',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.g.allnodes.com',
  'https://rpc.helius.xyz/?api-key=5db4c6f9-03ef-4d87-9b24-74765d776495' // Public-shared Helius key
];

/**
 * Fetches assets using DAS getAssetsByOwner with client-side RPC rotation.
 */
const fetchAssetsWithRotation = async (userAddress) => {
  for (const rpcUrl of PUBLIC_DAS_RPCS) {
    try {
      console.log(`[useSubscriber] Trying DAS RPC: ${rpcUrl}`);
      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'accio',
          method: 'getAssetsByOwner',
          params: {
            ownerAddress: userAddress,
            page: 1,
            limit: 100,
            displayOptions: { showFungible: false }
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result && data.result.items) {
          console.log(`[useSubscriber] Success with ${rpcUrl}`);
          return data.result.items;
        }
      }
    } catch (e) {
      console.warn(`[useSubscriber] RPC ${rpcUrl} failed:`, e.message);
    }
  }
  return [];
};

export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [subscriberData, setSubscriberData] = useState(null);

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setLoadingStatus('Checking Subscription NFTs...');

    try {
      const userPkStr = userAddress.trim();
      
      // 1. Fetch DAS Assets (Compressed NFTs)
      const assets = await fetchAssetsWithRotation(userPkStr);
      let forever = 0;
      let redeemable = 0;

      assets.forEach(asset => {
        const attrs = asset.content?.metadata?.attributes || [];
        const isForever = attrs.some(a => {
            const v = String(a.value).toLowerCase();
            const t = String(a.trait_type || '').toLowerCase();
            return v === 'forever' || (t === 'subscription type' && v === 'forever') || (t === 'locked until' && v === 'forever');
        });
        const isRedeemable = attrs.some(a => {
            const v = String(a.value).toLowerCase();
            const t = String(a.trait_type || '').toLowerCase();
            return v === 'redeemable' || (t === 'subscription type' && v === 'redeemable');
        });
        if (isForever) forever++;
        if (isRedeemable) redeemable++;
      });

      // 2. Fetch Staked Amount from Go-API
      setLoadingStatus('Registry Fetch...');
      const poolsRes = await fetch(`${HUB_API_BASE}/pools?order=supporters&per_page=500`, { headers: HUB_HEADERS });
      const poolsData = await poolsRes.json();
      const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
      
      let totalAcs = 0n;
      const foundPools = new Set();
      
      setLoadingStatus('Calculating Stakes...');
      const QUEUE = [...poolList];
      const CONCURRENCY = 30;
      const worker = async () => {
        while (QUEUE.length > 0) {
          const pool = QUEUE.shift();
          try {
            const supRes = await fetch(`${HUB_API_BASE}/supporters/${pool.Pubkey}/locked?per_page=1000`, { headers: HUB_HEADERS });
            if (supRes.ok) {
              const supData = await supRes.json();
              const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
              const s = supporters.find(s => s.pubkey === userPkStr || s.address === userPkStr);
              if (s) {
                totalAcs += BigInt(s.amount);
                foundPools.add(pool.Pubkey);
              }
            }
          } catch (e) {}
        }
      };

      await Promise.all(Array(CONCURRENCY).fill(0).map(() => worker()));

      setSubscriberData({
        totalStaked: Math.floor(Number(totalAcs / 1000000n)),
        poolCount: foundPools.size,
        address: userPkStr,
        foreverCount: forever,
        redeemableCount: redeemable
      });

    } catch (err) {
      console.error('[useSubscriber] Error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return { fetchSubscriberData, subscriberData, isLoading, loadingStatus };
};
