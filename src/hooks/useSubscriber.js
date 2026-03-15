import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

// Final Access Protocol On-Chain Aggregator v2 (tNFT Support)
const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const ACCESS_COLLECTION_ID = '7qbSm8mJSmnZX5c18RF4o7yCdeAkyKVcgCR8geTRSexT';
const ACCESS_UPDATE_AUTHORITY = '97VhuEes8ExokBvG7hxyexpFPGzZu18SZERVKseqVV9';
const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const RPC_ENDPOINTS = [
  'https://rpc.ankr.com/solana',
  'https://api.mainnet-beta.solana.com',
  'https://solana.publicnode.com'
];

export const useSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriberData, setSubscriberData] = useState(null);

  const fetchSubscriberData = async (userAddress) => {
    if (!userAddress) return;
    setIsLoading(true);
    setError(null);

    const endpoint = RPC_ENDPOINTS[0]; // Start with primary
    try {
      const connection = new Connection(endpoint, 'confirmed');
      const userPk = new PublicKey(userAddress.trim());

      // 1. Fetch Regular Staking (StakeAccount - Tag 3)
      const regularAccountsPromise = connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
        filters: [
          { dataSize: 89 },
          { memcmp: { offset: 0, bytes: '4' } }, // Tag::StakeAccount (3)
          { memcmp: { offset: 1, bytes: userPk.toBase58() } }
        ]
      });

      // 2. Fetch Token Accounts to find tNFTs
      const tokenAccountsPromise = connection.getTokenAccountsByOwner(userPk, {
        programId: TOKEN_PROGRAM_ID
      });

      const [regAccounts, tokenAccountsRes] = await Promise.all([regularAccountsPromise, tokenAccountsPromise]);
      
      const potentialMints = tokenAccountsRes.value
        .filter(ta => {
          // data is a Buffer with polyfills
          const amount = ta.account.data.readBigUInt64LE(64);
          return amount === 1n;
        })
        .map(ta => new PublicKey(ta.account.data.slice(0, 32)));

      // 3. Batch fetch Metadata for potential mints to identify Access NFTs
      const accessMints = [];
      if (potentialMints.length > 0) {
        const metadataPdas = potentialMints.map(mint => 
          PublicKey.findProgramAddressSync(
            [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            METAPLEX_PROGRAM_ID
          )[0]
        );

        // Fetch in chunks of 100
        const metadataInfos = await connection.getMultipleAccountsInfo(metadataPdas);
        metadataInfos.forEach((info, idx) => {
          if (!info) return;
          // Metaplex Metadata Layout: Offset 1 is Update Authority
          const updateAuth = new PublicKey(info.data.slice(1, 33)).toBase58();
          if (updateAuth === ACCESS_UPDATE_AUTHORITY) {
            accessMints.push(potentialMints[idx]);
          }
        });
      }

      // 4. Fetch Bonds for all identified Access Mints
      // We query the Access Program for any account where 'owner' (offset 1) is our Mint
      // This covers BondAccount (Tag 5) and BondV2Account (Tag 12)
      const bondPromises = accessMints.map(mint => 
        connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
          filters: [
            { memcmp: { offset: 1, bytes: mint.toBase58() } }
          ]
        })
      );

      const allBondResults = await Promise.all(bondPromises);
      const allAccounts = [...regAccounts, ...allBondResults.flat()];

      let totalStaked = 0;
      const pools = new Set();

      allAccounts.forEach(({ account }) => {
        const tag = account.data[0];
        let amount = 0n;
        let poolPk;

        if (tag === 3) { // StakeAccount
          amount = account.data.readBigUInt64LE(33);
          poolPk = new PublicKey(account.data.slice(41, 73));
        } else if (tag === 5) { // BondAccount (V1)
          amount = account.data.readBigUInt64LE(41); // total_staked
          poolPk = new PublicKey(account.data.slice(169, 201));
        } else if (tag === 12) { // BondV2Account
          amount = account.data.readBigUInt64LE(33);
          poolPk = new PublicKey(account.data.slice(41, 73));
        }

        totalStaked += Number(amount) / 1_000_000;
        if (poolPk) pools.add(poolPk.toBase58());
      });

      setSubscriberData({
        totalStaked: Math.floor(totalStaked),
        poolCount: pools.size,
        address: userAddress
      });
      setIsLoading(false);

    } catch (err) {
      console.error('Subscriber fetch error:', err);
      setError('Failed to fetch subscription data. Please check the address.');
      setIsLoading(false);
    }
  };

  return { fetchSubscriberData, subscriberData, isLoading, error };
};
