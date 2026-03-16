import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUf9ee24ffCdG3fJJhqymnz2fH1n579kauXj');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const HUB_API_BASE = 'https://go-api.accessprotocol.co';
const HUB_HEADERS = {
  'Origin': 'https://hub.accessprotocol.co',
  'Referer': 'https://hub.accessprotocol.co/',
  'Accept': 'application/json'
};

// Generic RPC proxy endpoint
const PROXY_RPC = '/api/das';

// Global cache for the pool list to avoid re-fetching on every user fetch
let cachedPoolList = null;
let lastPoolFetchTime = 0;
const POOL_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Fetches subscription type counts (Forever/Redeemable) via manual NFT metadata scan.
 * Scans all NFTs, derives Metaplex metadata, and checks traits in external JSON.
 */
const fetchSubscriptionTypeCounts = async (userAddress) => {
  let forever = 0;
  let redeemable = 0;

  try {
    console.log(`[useSubscriber] Scanning NFT metadata for traits...`);
    
    // We use a custom fetcher for the Connection to route through our proxy
    const proxyConnection = new Connection(window.location.origin + PROXY_RPC, 'confirmed');
    const userPk = new PublicKey(userAddress);

    // 1. Get potential NFTs
    const tokenAccounts = await proxyConnection.getParsedTokenAccountsByOwner(userPk, {
      programId: TOKEN_PROGRAM_ID
    });

    const nftMints = tokenAccounts.value
      .filter(a => {
        const info = a.account.data.parsed.info;
        return info.tokenAmount.uiAmount === 1 && info.tokenAmount.decimals === 0;
      })
      .map(a => new PublicKey(a.account.data.parsed.info.mint));

    if (nftMints.length === 0) return { forever: 0, redeemable: 0 };
    console.log(`[useSubscriber] Found ${nftMints.length} potential NFTs, checking metadata...`);

    // 2. Derive Metadata PDAs
    const metadataPdas = nftMints.map(mint => {
      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        METAPLEX_PROGRAM_ID
      );
      return pda;
    });

    // 3. Fetch Metadata Account Data
    // Split into chunks if there are many NFTs (getMultipleAccountsInfo limit is usually 100)
    const metadataAccounts = [];
    for (let i = 0; i < metadataPdas.length; i += 100) {
        const chunk = metadataPdas.slice(i, i + 100);
        const results = await proxyConnection.getMultipleAccountsInfo(chunk);
        metadataAccounts.push(...results);
    }

    // 4. Parse URIs and check for traits
    const fetchPromises = metadataAccounts.map(async (acc) => {
        if (!acc) return;
        try {
            const data = Buffer.from(acc.data);
            // Metaplex Metadata Layout:
            // Key (1) | Update Auth (32) | Mint (32) | Name (32+4) | Symbol (10+4) | URI (200+4)
            // Offset for URI length: 1 + 32 + 32 + 36 + 14 = 115
            const uriLen = data.readUInt32LE(115);
            const uri = data.slice(115 + 4, 115 + 4 + uriLen).toString().replace(/\0/g, '');
            
            // Fetch the JSON metadata (Arweave/IPFS)
            const metaRes = await fetch(uri);
            if (metaRes.ok) {
                const json = await metaRes.json();
                const attrs = json.attributes || [];
                const isForever = attrs.some(a => String(a.value).toLowerCase() === 'forever');
                const isRedeemable = attrs.some(a => String(a.value).toLowerCase() === 'redeemable');
                
                if (isForever) forever++;
                if (isRedeemable) redeemable++;
            }
        } catch (e) {
            // Ignore individual metadata fetch failures
        }
    });

    await Promise.all(fetchPromises);
    console.log(`[useSubscriber] Scan complete. Forever: ${forever}, Redeemable: ${redeemable}`);
    return { forever, redeemable };

  } catch (e) {
    console.warn(`[useSubscriber] Manual NFT scan failed:`, e.message);
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
    console.log('[useSubscriber] Starting secure manual scan for:', userAddress);

    try {
      const userPkStr = userAddress.trim();
      
      // 1. Get Pool List (from cache or API)
      let poolList = cachedPoolList;
      const now = Date.now();
      if (!poolList || (now - lastPoolFetchTime > POOL_CACHE_DURATION)) {
        setLoadingStatus('Registry Fetch...');
        const poolsRes = await fetch(`${HUB_API_BASE}/pools?order=supporters&per_page=500`, { headers: HUB_HEADERS });
        if (!poolsRes.ok) throw new Error('Failed to fetch pools');
        const poolsData = await poolsRes.json();
        poolList = Object.values(poolsData).filter(p => p && p.Pubkey);
        cachedPoolList = poolList;
        lastPoolFetchTime = now;
      }
      
      let totalAcs = 0n;
      const foundPools = new Set();
      
      // 2. Parallel Pool Scanning and Subscription Type Verification
      const CONCURRENCY = 25; 
      const poolQueue = [...poolList];
      
      const scanWorker = async () => {
        while (poolQueue.length > 0) {
          const pool = poolQueue.shift();
          if (!pool) break;
          
          try {
            const supRes = await fetch(`${HUB_API_BASE}/supporters/${pool.Pubkey}/locked?per_page=1000`, { 
              headers: HUB_HEADERS,
            });
            
            if (supRes.ok) {
              const supData = await supRes.json();
              const supporters = Array.isArray(supData) ? supData : (supData.supporters || []);
              const supporter = supporters.find(s => s.pubkey === userPkStr || s.address === userPkStr);
              if (supporter) {
                totalAcs += BigInt(supporter.amount);
                foundPools.add(pool.Pubkey);
              }
            }
          } catch (e) {}
        }
      };

      setLoadingStatus('Verifying Subscriptions...');
      const workers = Array(CONCURRENCY).fill(0).map(() => scanWorker());
      const [, typeCounts] = await Promise.all([
        Promise.all(workers),
        fetchSubscriptionTypeCounts(userPkStr)
      ]);

      // 3. Resilience Multi-Check
      setLoadingStatus('Finalizing...');
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
      try {
        const regAccounts = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
          filters: [
            { dataSize: 89 },
            { memcmp: { offset: 1, bytes: new PublicKey(userPkStr).toBase58() } }
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
      } catch (e) {}

      const finalAcs = Number(totalAcs / 1000000n);
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
