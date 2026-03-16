import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const STAKE_APY = 28.55;

// Use the local proxy for RPC to bypass CORS/Direct Blocks
const RPC_ENDPOINT = window.location.origin + '/api/das';

export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [subscriberData, setSubscriberData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setLoadingStatus('Initializing Sync...');
    setError(null);

    try {
      const userPkStr = userAddress.trim();
      let userPk;
      try {
        userPk = new PublicKey(userPkStr);
      } catch (e) {
        throw new Error('Invalid Wallet Address format.');
      }
      
      const connection = new Connection(RPC_ENDPOINT, {
        commitment: 'confirmed',
        fetch: async (url, options) => {
          const res = await fetch(RPC_ENDPOINT, {
            ...options,
            method: 'POST',
            headers: { ...options.headers, 'Content-Type': 'application/json' }
          });
          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.error || `RPC Error: ${res.status}`);
          }
          return res;
        }
      });
      
      setLoadingStatus('Scanning Blockchain...');
      
      const subscriptions = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
        filters: [
          { memcmp: { offset: 1, bytes: userPk.toBase58() } }
        ]
      });

      if (subscriptions.length === 0) {
        console.log('[useSubscriber] No subscriptions found.');
      }

      let totalAcs = 0n;
      const foundPools = new Set();

      subscriptions.forEach(({ account }) => {
        try {
          const data = Buffer.from(account.data);
          if (data.length >= 73) {
            const amount = data.readBigUInt64LE(33);
            const poolPk = new PublicKey(data.slice(41, 73)).toBase58();
            
            if (amount > 0n) {
              totalAcs += amount;
              foundPools.add(poolPk);
            }
          }
        } catch (e) {
          console.warn('[useSubscriber] Failed to parse account:', e);
        }
      });

      setSubscriberData({
        totalStaked: Math.floor(Number(totalAcs / 1000000n)),
        poolCount: foundPools.size,
        address: userPkStr,
        stakeApy: STAKE_APY
      });

    } catch (err) {
      console.error('[useSubscriber] Sync Error:', err);
      setError(err.message || 'Synchronization failed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return { fetchSubscriberData, subscriberData, isLoading, loadingStatus, error };
};
