import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const HUB_API_BASE = 'https://go-api.accessprotocol.co';
const HUB_HEADERS = {
  'Origin': 'https://hub.accessprotocol.co',
  'Referer': 'https://hub.accessprotocol.co/',
  'Accept': 'application/json'
};

const STAKE_APY = 28.55;

export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [subscriberData, setSubscriberData] = useState(null);

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setLoadingStatus('Initializing Scan...');

    try {
      const userPkStr = userAddress.trim();
      
      // 1. Fetch Subscriber Stake Info from Go-API
      setLoadingStatus('Registry Fetch...');
      const poolsRes = await fetch(`${HUB_API_BASE}/pools?order=supporters&per_page=500`, { headers: HUB_HEADERS });
      const poolsData = await poolsRes.json();
      const poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
      
      let totalAcs = 0n;
      const foundPools = new Set();
      
      setLoadingStatus('Scanning Pools...');
      const QUEUE = [...poolList];
      const CONCURRENCY = 40; // High concurrency for faster API scanning
      
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
        stakeApy: STAKE_APY
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
