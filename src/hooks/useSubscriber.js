import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const MAIN_PROGRAM = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const FETCH_TIMEOUT = 12000;
const DAS_ENDPOINT = window.location.origin + '/api/das';

/**
 * High-Speed Hybrid Sync Hook (cNFT + Hub API + RPC)
 * Captures standard stake and Transferable Subscriptions (cNFTs).
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

  const fetchCnfts = async (wallet) => {
    try {
      const res = await fetchWithTimeout(DAS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'accio-cnft-sync',
          method: 'getAssetsByOwner',
          params: { ownerAddress: wallet, page: 1, limit: 100 }
        })
      });

      if (!res.ok) return { total: 0, pools: new Set() };
      const data = await res.json();
      const items = data.result?.items || [];
      
      let total = 0;
      const pools = new Set();

      items.forEach(item => {
        const attributes = item.content?.metadata?.attributes || [];
        const isAccess = item.content?.metadata?.symbol === 'ACS' || 
                         attributes.some(a => a.trait_type === 'Subscription Type');

        if (isAccess) {
          const amountAttr = attributes.find(a => a.trait_type === 'Amount');
          if (amountAttr) {
            const val = parseFloat(amountAttr.value);
            if (!isNaN(val)) total += val;
          }
          
          const poolAttr = attributes.find(a => a.trait_type === 'Creator Pool Name' || a.trait_type === 'Creator Name');
          if (poolAttr) pools.add(poolAttr.value);
          else pools.add(item.id);
        }
      });

      return { total, pools };
    } catch (e) {
      console.warn('[Sync] cNFT check failed:', e);
      return { total: 0, pools: new Set() };
    }
  };

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setSubscriberData(null);
    setError(null);
    setLoadingStatus('Syncing Staked Balance...');

    try {
      const wallet = userAddress.trim();
      let totalStaked = 0;
      let poolCount = 0;
      const activePools = new Set();

      // 1. Parallel Multi-Source Check
      setLoadingStatus('Checking Hub & NFTs...');
      
      const [apiResults, cnftResult] = await Promise.all([
        // Standard API
        Promise.all(['locked', 'forever', 'redeemable'].map(type => 
          fetchWithTimeout(`https://go-api.accessprotocol.co/supporters/${type}?user_pubkey=${wallet}`, {
            headers: { 'Origin': 'https://hub.accessprotocol.co' }
          }).then(r => r.ok ? r.json() : null).catch(() => null)
        )),
        // cNFT Logic
        fetchCnfts(wallet)
      ]);

      // Process API Results
      apiResults.forEach(data => {
        if (data && data.total) {
          totalStaked += Number(data.total);
          // We can't easily get unique pool names from this API, but we know the count
          poolCount += Number(data.supporters_count || 0);
        }
      });

      // Process cNFT Results
      totalStaked += cnftResult.total;
      cnftResult.pools.forEach(p => activePools.add(p));

      // 2. Targeted RPC Fallback (Only if still 0 or for deep verification)
      if (totalStaked === 0) {
        setLoadingStatus('Deep Scanning Chain...');
        const connection = new Connection(DAS_ENDPOINT);
        const userPk = new PublicKey(wallet);
        
        const [off1, off8] = await Promise.all([
          connection.getProgramAccounts(MAIN_PROGRAM, { filters: [{ memcmp: { offset: 1, bytes: userPk.toBase58() } }] }).catch(() => []),
          connection.getProgramAccounts(MAIN_PROGRAM, { filters: [{ memcmp: { offset: 8, bytes: userPk.toBase58() } }] }).catch(() => [])
        ]);

        const allAccs = [...off1, ...off8];
        let rpcTotal = 0n;
        allAccs.forEach(a => {
          const data = Buffer.from(a.account.data);
          if (data.length >= 41) {
            const amt = data.readBigUInt64LE(33);
            if (amt > 0n && amt < 1000000000000000n) rpcTotal += amt;
            activePools.add(a.pubkey.toBase58());
          }
        });

        if (rpcTotal > 0n) {
          totalStaked += Number(rpcTotal / 1000000n);
        }
      }

      setSubscriberData({
        totalStaked: Math.floor(totalStaked),
        poolCount: Math.max(poolCount, activePools.size),
        address: wallet,
        stakeApy: 28.55
      });

    } catch (err) {
      console.error('[Sync] Error:', err);
      setError('Sync failed. Please check your wallet address.');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return { fetchSubscriberData, subscriberData, isLoading, loadingStatus, error };
};
