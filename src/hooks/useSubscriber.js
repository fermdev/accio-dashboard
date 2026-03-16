import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const STAKE_APY = 28.55;

// Use a reliable public RPC for direct program scans
const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [subscriberData, setSubscriberData] = useState(null);

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setLoadingStatus('Syncing Blockchain Data...');

    try {
      const userPkStr = userAddress.trim();
      const userPk = new PublicKey(userPkStr);
      const connection = new Connection(RPC_ENDPOINT, 'confirmed');
      
      // 1. Single high-speed RPC call to find all user subscriptions
      // Program: 6HW8dX... (Access)
      // Account Size: 89 bytes
      // Filter: User Pubkey at offset 1
      const subscriptions = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
        filters: [
          { dataSize: 89 },
          { memcmp: { offset: 1, bytes: userPk.toBase58() } }
        ]
      });

      let totalAcs = 0n;
      const foundPools = new Set();

      // 2. Process account data buffers instantly
      subscriptions.forEach(({ account }) => {
        const data = Buffer.from(account.data);
        // Offset 33: Staked Amount (u64)
        // Offset 41: Pool Pubkey (32 bytes)
        const amount = data.readBigUInt64LE(33);
        const poolPk = new PublicKey(data.slice(41, 73)).toBase58();
        
        totalAcs += amount;
        foundPools.add(poolPk);
      });

      setSubscriberData({
        totalStaked: Math.floor(Number(totalAcs / 1000000n)),
        poolCount: foundPools.size,
        address: userPkStr,
        stakeApy: STAKE_APY
      });

    } catch (err) {
      console.error('[useSubscriber] RPC Scan Error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  return { fetchSubscriberData, subscriberData, isLoading, loadingStatus };
};
