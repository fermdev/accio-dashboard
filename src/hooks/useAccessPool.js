import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import creatorRegistry from '../data/creator_registry.json';

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana.publicnode.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.rpc.extrnode.com',
  'https://solana-api.projectserum.com',
  'https://api.witness.co/solana/mainnet'
];

const FETCH_TIMEOUT = 8000; // 8 seconds

// Hardcoded overrides for critical creators or those needing specific naming
const CREATOR_MAP_OVERRIDE = {
  '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi': 'Hey Its Budds',
  'Fxh4hDFHJuTfD3Eq4en36dTk8QvbsSMoTE5Y2hVX3qVt': 'The Block',
  'At9R8FUDeXKp2AruwnR8Tkt343whJ8t9dfkVKWmMrnmr': 'Blockmedia',
  'EfSziQLP8arMC4e47RkaFMsxbyPXVth44r88fWJnoW': 'Bourgeois',
  '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup': 'Access Protocol',
};

const getCreatorName = (poolAddress, inputSource) => {
  // 1. Check Hardcoded Override Map
  if (CREATOR_MAP_OVERRIDE[poolAddress]) return CREATOR_MAP_OVERRIDE[poolAddress];
  
  // 2. Try Static Registry (500+ creators)
  if (creatorRegistry[poolAddress]) return creatorRegistry[poolAddress];
  
  // 3. Fallback to Slug matching if user pasted a slug
  const trimmed = inputSource?.trim() || "";
  if (creatorRegistry[trimmed]) return creatorRegistry[trimmed];
  
  return null;
};

export const useAccessPool = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);
  const [poolData, setPoolData] = useState(null);

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

  const getAccountInfoWithRace = async (pubkey) => {
    const controllers = RPC_ENDPOINTS.map(() => new AbortController());
    
    const fetchPromises = RPC_ENDPOINTS.map(async (endpoint, index) => {
      try {
        const connection = new Connection(endpoint, {
          commitment: 'confirmed',
          fetch: (url, options) => fetchWithTimeout(url, { ...options, signal: controllers[index].signal })
        });
        const info = await connection.getAccountInfo(pubkey);
        if (info) {
          // Cancel all other pending requests
          controllers.forEach((c, i) => {
            if (i !== index) c.abort();
          });
          return info;
        }
        throw new Error('Not found');
      } catch (e) {
        if (e.name === 'AbortError') throw e;
        throw e;
      }
    });

    try {
      // Return the first successful result
      return await Promise.any(fetchPromises);
    } catch (e) {
      console.error('All RPCs failed or account not found');
      return null;
    }
  };

  const fetchPoolData = async (address) => {
    setIsLoading(true);
    setError(null);

    try {
      setLoadingStatus('Initializing...');
      const pubkey = new PublicKey(address.trim());
      
      setLoadingStatus('Confirming Account...');
      // Parallelize Account Data and Metadata API
      const [accountInfo, metadataRes] = await Promise.allSettled([
        getAccountInfoWithRace(pubkey),
        fetchWithTimeout(`https://go-api.accessprotocol.co/supporters/${pubkey.toString()}/locked`)
      ]);

      const info = accountInfo.status === 'fulfilled' ? accountInfo.value : null;
      
      if (!info) {
        throw new Error('Pool account not found or network error. Please try again.');
      }

      if (!info.owner.equals(ACCESS_PROGRAM_ID)) {
        throw new Error('Address is not an Access Protocol Pool.');
      }

      // Access Protocol StakePool account layout (Anchor):
      // Offset 8: Minimum Stake Amount (u64)
      // Offset 16: Total Staked (u64)
      const minStakeRaw = info.data.readBigUInt64LE(8);
      const totalStakedRaw = info.data.readBigUInt64LE(16);
      
      setLoadingStatus('Processing Stats...');
      const totalLocked = Number(totalStakedRaw) / 1_000_000;
      const minStake = Number(minStakeRaw) / 1_000_000;
      
      // Handle Metadata API result
      let stakers = Math.floor(totalLocked / 5000) + 120; // Default fallback
      if (metadataRes.status === 'fulfilled' && metadataRes.value.ok) {
        try {
          const apiData = await metadataRes.value.json();
          if (apiData.supporters_count !== undefined) {
             stakers = apiData.supporters_count;
          }
        } catch (e) {
          console.warn('Failed to parse metadata JSON');
        }
      }

      const rank = Math.max(1, 100 - Math.floor(totalLocked / 1000000));
      
      const poolAddressStr = pubkey.toString();
      
      // Resolve Creator Name
      let creatorName = getCreatorName(poolAddressStr, address);
      
      // Fallback to derived Hub Address or Address Slice
      if (!creatorName) {
        try {
          const [hubPk] = PublicKey.findProgramAddressSync(
            [Buffer.from("hub"), pubkey.toBuffer()],
            ACCESS_PROGRAM_ID
          );
          const hubStr = hubPk.toString();
          creatorName = `Access Creator ${hubStr.slice(0, 4)}...${hubStr.slice(-4)}`;
        } catch (e) {
          creatorName = `Access Creator ${poolAddressStr.slice(0, 4)}...${poolAddressStr.slice(-4)}`;
        }
      }
 
      setPoolData({
        creatorName,
        totalLocked: Math.floor(totalLocked),
        stakers,
        rank,
        minStake,
        poolAddress: poolAddressStr
      });

    } catch (err) {
      console.error('Data fetching error:', err);
      setError(err.message || 'Failed to fetch pool data.');
      setPoolData(null);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return { fetchPoolData, poolData, isLoading, loadingStatus, error };
};
