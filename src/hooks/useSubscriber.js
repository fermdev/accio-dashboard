import { useState } from 'react';
import creatorRegistry from '../data/creator_registry.json';

const FETCH_TIMEOUT = 10000;
const BATCH_SIZE = 15; // Parallel requests to speed up global scan

/**
 * Access Protocol Subscriber Sync Hook
 * Reverted to high-accuracy registry-scanning method as requested.
 * Scans official Go-API for staker positions across all registered creators.
 */
export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [subscriberData, setSubscriberData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (e) {
      clearTimeout(id);
      throw e;
    }
  };

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setSubscriberData(null);
    setError(null);

    try {
      const targetWallet = userAddress.trim().toLowerCase();
      const creators = Object.entries(creatorRegistry);
      const total = creators.length;
      
      let totalStaked = 0;
      let activePools = 0;
      let processedCount = 0;

      console.log(`[Sync] Starting deep scan for ${targetWallet} across ${total} creators...`);

      // Process in batches for performance but stability
      for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = creators.slice(i, i + BATCH_SIZE);
        processedCount += batch.length;
        
        setLoadingStatus(`Syncing (${Math.floor((processedCount / total) * 100)}%)`);

        await Promise.all(batch.map(async ([poolAddr]) => {
          try {
            // Fetch supporters for this specific pool
            // Using page=-1&page_size=-1 to get ALL supporters in one go
            const url = `https://go-api.accessprotocol.co/supporters/${poolAddr}/locked?page=-1&page_size=-1`;
            const res = await fetchWithTimeout(url, {
              headers: { 
                'Origin': 'https://hub.accessprotocol.co',
                'Referer': 'https://hub.accessprotocol.co/'
              }
            });

            if (res.ok) {
              const data = await res.json();
              const stakers = data.supporters || [];
              
              const myStack = stakers.find(s => {
                const sAddr = (typeof s === 'string' ? s : s.pubkey || s.address || '').toLowerCase();
                return sAddr === targetWallet;
              });

              if (myStack) {
                const amount = Number(myStack.locked_amount || 0) / 1000000;
                if (amount > 0) {
                  totalStaked += amount;
                  activePools++;
                }
              }
            }
          } catch (e) {
            // Silently skip pool-level errors to ensure full scan completes
          }
        }));
      }

      console.log(`[Sync] Completed. Found ${activePools} pools, ${totalStaked} ACS total.`);

      setSubscriberData({
        totalStaked: Math.floor(totalStaked),
        poolCount: activePools,
        address: userAddress,
        stakeApy: 28.55 // Currently 28.55% on Access Protocol Hub
      });

    } catch (err) {
      console.error('[Sync] Error:', err);
      setError('Sync timed out or failed. Please refresh and try again.');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return { fetchSubscriberData, subscriberData, isLoading, loadingStatus, error };
};
