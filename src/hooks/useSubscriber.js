import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const HUB_API_BASE = 'https://go-api.accessprotocol.co';
const HUB_HEADERS = {
  'Origin': 'https://hub.accessprotocol.co',
  'Referer': 'https://hub.accessprotocol.co/',
  'Accept': 'application/json'
};

const RPC_ENDPOINTS = [
  'https://rpc.ankr.com/solana',
  'https://api.mainnet-beta.solana.com',
  'https://solana.publicnode.com'
];

// DAS API endpoint via Vite proxy (avoids CORS 403 from mainnet-beta when called from browser)
const DAS_RPC = '/das-rpc';

// Global cache for the pool list to avoid re-fetching on every user fetch
let cachedPoolList = null;
let lastPoolFetchTime = 0;
const POOL_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Fetches subscription type counts (Forever/Redeemable) via DAS API.
 * Scans all NFTs owned by the address and finds ones with "Subscription Type" attribute.
 */
const fetchSubscriptionTypeCounts = async (userAddress) => {
  // Try multiple endpoints if the proxy fails
  const endpoints = [DAS_RPC, 'https://solana-mainnet.g.allnodes.com', 'https://api.mainnet-beta.solana.com'];

  for (const endpoint of endpoints) {
    let forever = 0;
    let redeemable = 0;
    let page = 1;
    let success = false;

    try {
      console.log(`[useSubscriber] Attempting subscription type fetch from: ${endpoint}`);
      while (true) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'get-assets-' + Date.now(),
            method: 'getAssetsByOwner',
            params: {
              ownerAddress: userAddress,
              page,
              limit: 1000,
              displayOptions: { showFungible: false }
            }
          })
        });

        if (!res.ok) {
          console.warn(`[useSubscriber] Endpoint ${endpoint} failed with status: ${res.status}`);
          break;
        }

        const data = await res.json();
        if (data.error) {
          console.warn(`[useSubscriber] Endpoint ${endpoint} returned RPC error:`, data.error);
          break;
        }

        const items = data.result?.items || [];
        if (items.length === 0) break;

        // Count subscription types
        items.forEach(item => {
          const attrs = item.content?.metadata?.attributes || [];
          // Look for Forever/Redeemable in any attribute value for maximum resilience
          const hasForever = attrs.some(a => String(a.value).toLowerCase() === 'forever');
          const hasRedeemable = attrs.some(a => String(a.value).toLowerCase() === 'redeemable');
          
          if (hasForever) forever++;
          if (hasRedeemable) redeemable++;
        });

        if (items.length < 1000) {
          success = true;
          break;
        }
        page++;
      }
      
      // If we successfully queried at least one page and found anything, or finished the whole set
      if (success) {
        console.log(`[useSubscriber] Found ${forever} Forever, ${redeemable} Redeemable via ${endpoint}`);
        return { forever, redeemable };
      }
    } catch (e) {
      console.warn(`[useSubscriber] Fetch via ${endpoint} failed:`, e.message);
      // Continue to next endpoint
    }
  }

  return { forever: 0, redeemable: 0 };
};

export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);
  const [subscriberData, setSubscriberData] = useState(null);

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setLoadingStatus('Initializing Scan...');
    setError(null);
    console.log('[useSubscriber] Starting optimized fetch for:', userAddress);

    try {
      const userPkStr = userAddress.trim();
      
      // 1. Get Pool List (from cache or API)
      let poolList = cachedPoolList;
      const now = Date.now();
      if (!poolList || (now - lastPoolFetchTime > POOL_CACHE_DURATION)) {
        setLoadingStatus('Registry Fetch...');
        console.log('[useSubscriber] Fetching/Refreshing creator pools...');
        const poolsRes = await fetch(`${HUB_API_BASE}/pools?order=supporters&per_page=500`, { headers: HUB_HEADERS });
        if (!poolsRes.ok) throw new Error('Failed to fetch pools');
        const poolsData = await poolsRes.json();
        poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
        cachedPoolList = poolList;
        lastPoolFetchTime = now;
      }
      setLoadingStatus('Scanning Active Pools...');
      console.log(`[useSubscriber] Scanning ${poolList.length} pools with high concurrency...`);

      let totalAcs = 0n;
      const foundPools = new Set();
      
      // 2. High Concurrency Scanning + Subscription Type Fetch (in parallel)
      const CONCURRENCY = 25; 
      const poolQueue = [...poolList];
      
      const scanWorker = async () => {
        while (poolQueue.length > 0) {
          const pool = poolQueue.shift();
          if (!pool) break;
          
          try {
            const supRes = await fetch(`${HUB_API_BASE}/supporters/${pool.Pubkey}/locked?per_page=1000`, { 
              headers: HUB_HEADERS,
              // Add a bit of timeout logic if possible, though fetch timeout is tricky in browser
            });
            
            if (supRes.ok) {
              const supData = await supRes.json();
              const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
              const supporter = supporters.find(s => s.pubkey === userPkStr || s.address === userPkStr);
              if (supporter) {
                const amount = BigInt(supporter.amount);
                console.log(`[useSubscriber] Found in ${pool.Name}: ${amount.toString()}`);
                totalAcs += amount;
                foundPools.add(pool.Pubkey);
              }
            }
          } catch (e) {
            // Ignore individual failures
          }
        }
      };

      // Start pool scan workers AND subscription type fetch in parallel
      setLoadingStatus('Collecting Subscription Types...');
      const workers = Array(CONCURRENCY).fill(0).map(() => scanWorker());
      const [, typeCounts] = await Promise.all([
        Promise.all(workers),
        fetchSubscriptionTypeCounts(userPkStr)
      ]);

      // 3. Fast On-Chain Fallback
      setLoadingStatus('Aggregating Results...');
      console.log('[useSubscriber] Fast on-chain check...');
      // We only check the most reliable RPC
      const connection = new Connection(RPC_ENDPOINTS[0], 'confirmed');
      const userPk = new PublicKey(userPkStr);
      try {
        const regAccounts = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
          filters: [
            { dataSize: 89 },
            { memcmp: { offset: 0, bytes: '4' } }, 
            { memcmp: { offset: 1, bytes: userPk.toBase58() } }
          ]
        });

        regAccounts.forEach(({ account }) => {
          const data = Buffer.from(account.data);
          const amount = data.readBigUInt64LE(33);
          const poolPk = new PublicKey(data.slice(41, 73)).toBase58();
          if (!foundPools.has(poolPk)) {
            totalAcs += amount;
            foundPools.add(poolPk);
          }
        });
      } catch (e) {
        console.warn('[useSubscriber] Fast fallback failed, skipping.');
      }

      const finalAcs = Number(totalAcs / 1000000n);
      console.log(`[useSubscriber] Optimized Result: ${finalAcs} ACS / ${foundPools.size} pools.`);
      console.log(`[useSubscriber] Types: Forever=${typeCounts.forever}, Redeemable=${typeCounts.redeemable}`);

      setSubscriberData({
        totalStaked: Math.floor(finalAcs),
        poolCount: foundPools.size,
        address: userPkStr,
        foreverCount: typeCounts.forever,
        redeemableCount: typeCounts.redeemable
      });
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return { fetchSubscriberData, subscriberData, isLoading, loadingStatus, error };
};
