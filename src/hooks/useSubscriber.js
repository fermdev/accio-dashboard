import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana.publicnode.com',
  'https://rpc.ankr.com/solana'
];

export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriberData, setSubscriberData] = useState(null);

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setError(null);

    // Try RPC endpoints sequentially for reliability
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        const connection = new Connection(endpoint, 'confirmed');
        const userPk = new PublicKey(userAddress.trim());

        // Access Protocol StakeAccount Layout:
        // offset 0: tag (u8) -> StakeAccount is 3
        // offset 1: owner (Pubkey)
        // offset 33: stake_amount (u64)
        // offset 41: stake_pool (Pubkey)
        
        // Base58 of byte [3] is '4'
        const accounts = await connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
          filters: [
            { dataSize: 89 },
            { memcmp: { offset: 0, bytes: '4' } }, // Tag::StakeAccount (3)
            { memcmp: { offset: 1, bytes: userPk.toBase58() } }
          ]
        });

        let totalStaked = 0;
        const pools = new Set();

        accounts.forEach(({ account }) => {
          // data is a Buffer in Node/Vite with polyfills
          const amount = account.data.readBigUInt64LE(33);
          totalStaked += Number(amount) / 1_000_000;
          
          // stake_pool starts at 41, 32 bytes
          const poolPk = new PublicKey(account.data.slice(41, 73));
          pools.add(poolPk.toBase58());
        });

        setSubscriberData({
          totalStaked: Math.floor(totalStaked),
          poolCount: pools.size,
          address: userAddress
        });
        
        // If successful, break the loop
        setIsLoading(false);
        return;

      } catch (err) {
        console.warn(`RPC ${endpoint} failed, trying next...`, err);
        // Continue to next RPC
      }
    }

    setError('Failed to fetch data from all available Solana RPCs.');
    setIsLoading(false);
  };

  return { fetchSubscriberData, subscriberData, isLoading, error };
};
