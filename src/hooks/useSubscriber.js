import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const MAIN_PROGRAM = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const FETCH_TIMEOUT = 12000;
const DAS_ENDPOINT = window.location.origin + '/api/das';
const SUPPORTERS_ENDPOINT = window.location.origin + '/api/supporters';

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
      setLoadingStatus('Searching for NFTs...');
      
      const rpcBody = {
        jsonrpc: '2.0',
        id: 'accio-cnft-sync',
        method: 'getAssetsByOwner',
        params: { 
          ownerAddress: wallet, 
          page: 1, 
          limit: 1000,
          displayOptions: {
            showEmptyTraits: false,
            showFungible: true,
            showZeroBalance: false
          }
        }
      };

      // Use proxy to ensure consistent headers and failover
      const res = await fetchWithTimeout(DAS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcBody)
      });

      if (!res || !res.ok) return { total: 0, pools: new Set() };
      const data = await res.json();
      const items = data.result?.items || [];
      
      let total = 0;
      const pools = new Set();

      items.forEach(item => {
        const attributes = item.content?.metadata?.attributes || 
                           item.metadata?.attributes || 
                           item.content?.attributes ||
                           item.attributes || [];
        
        const symbol = (item.content?.metadata?.symbol || item.symbol || '').toUpperCase();
        
        // Find Amount trait case-insensitively
        const amountAttr = attributes.find(a => {
          const t = String(a.trait_type || '').toLowerCase();
          return t === 'amount' || t === 'staking amount' || t === 'acs amount' || t === 'staked_amount';
        });

        const isAccess = symbol === 'ACS' || 
                         String(item.content?.metadata?.name || '').includes('Access') ||
                         !!amountAttr ||
                         attributes.some(a => {
                           const v = String(a.value || '').toLowerCase();
                           return v.includes('access protocol') || v.includes('acs');
                         });

        if (isAccess) {
          if (amountAttr) {
            const valStr = String(amountAttr.value || '0').split(' ')[0].replace(/,/g, '');
            const val = parseFloat(valStr);
            if (!isNaN(val)) total += val;
          }
          
          const poolAttr = attributes.find(a => {
            const t = String(a.trait_type || '').toLowerCase();
            return ['creator pool name', 'creator name', 'pool', 'creator', 'subscription pool'].includes(t);
          });
          
          if (poolAttr) pools.add(poolAttr.value);
          else if (item.content?.metadata?.name) pools.add(item.content.metadata.name);
          else if (item.id) pools.add(item.id.slice(0, 8) + '...');
        }
      });

      console.log(`[Sync] Found ${total} ACS in cNFTs across ${pools.size} pools.`);
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
      const activePools = new Set();

      // 1. Parallel Multi-Source Check
      setLoadingStatus('Checking Hub & NFTs...');
      
      const [apiResults, cnftResult] = await Promise.all([
        // Standard API (Always use Proxy to set Origin/Referer correctly)
        Promise.all(['locked', 'forever', 'redeemable'].map(type => 
          fetchWithTimeout(`${SUPPORTERS_ENDPOINT}?wallet=${wallet}&type=${type}`).then(r => r.ok ? r.json() : null).catch(() => null)
        )),
        // cNFT Logic
        fetchCnfts(wallet)
      ]);

      // Process Hub API Results
      apiResults.forEach(data => {
        if (data && (data.total || data.total_staked)) {
          totalStaked += Number(data.total || data.total_staked);
          if (data.stakers) data.stakers.forEach(s => activePools.add(s.pool_name || s.pool_address));
        }
      });

      // Process cNFT Results
      totalStaked += cnftResult.total;
      cnftResult.pools.forEach(p => activePools.add(p));

      // 2. Targeted RPC Fallback (Use standard RPC for gPA)
      if (totalStaked === 0) {
        setLoadingStatus('Deep Scanning Chain...');
        try {
          const connection = new Connection('https://solana.publicnode.com');
          const userPk = new PublicKey(wallet);
          const filters = [{ memcmp: { offset: 8, bytes: userPk.toBase58() } }];
          const accounts = await connection.getProgramAccounts(MAIN_PROGRAM, { filters });

          accounts.forEach(a => {
            const data = Buffer.from(a.account.data);
            if (data.length >= 41) {
              const amt = data.readBigUInt64LE(33);
              if (amt > 0n && amt < 1000000000000000n) {
                totalStaked += Number(amt / 1000000n);
                activePools.add(a.pubkey.toBase58());
              }
            }
          });
        } catch (rpcErr) {
          console.warn('[Sync] RPC fallback failed:', rpcErr);
        }
      }

      setSubscriberData({
        address: wallet,
        totalStaked: Math.floor(totalStaked),
        poolCount: activePools.size,
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
