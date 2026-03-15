import { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
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
    console.log('Fetching subscriber data for:', userAddress);

    for (const endpoint of RPC_ENDPOINTS) {
      try {
        console.log(`Trying RPC: ${endpoint}`);
        const connection = new Connection(endpoint, 'confirmed');
        const userPk = new PublicKey(userAddress.trim());

        // 1. Fetch Regular Staking (StakeAccount - Tag 3)
        console.log('Fetching regular stake accounts...');
        const regularAccountsPromise = connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
          filters: [
            { dataSize: 89 },
            { memcmp: { offset: 0, bytes: '4' } }, // Tag::StakeAccount (3) in base58 is '4'
            { memcmp: { offset: 1, bytes: userPk.toBase58() } }
          ]
        });

        // 2. Fetch Token Accounts to find potential tNFTs
        console.log('Fetching token accounts...');
        const tokenAccountsPromise = connection.getTokenAccountsByOwner(userPk, {
          programId: TOKEN_PROGRAM_ID
        });

        const [regAccounts, tokenAccountsRes] = await Promise.all([regularAccountsPromise, tokenAccountsPromise]);
        console.log(`Found ${regAccounts.length} regular stake accounts and ${tokenAccountsRes.value.length} token accounts`);
        
        const potentialMints = tokenAccountsRes.value
          .filter(ta => {
            const amount = Buffer.from(ta.account.data).readBigUInt64LE(64);
            return amount === 1n;
          })
          .map(ta => new PublicKey(ta.account.data.slice(0, 32)));
        
        console.log(`Potential mints ( NFTs): ${potentialMints.length}`);

        // 3. Batch fetch Metadata for potential mints to identify Access NFTs
        const accessMints = [];
        if (potentialMints.length > 0) {
          const metadataPdas = potentialMints.map(mint => 
            PublicKey.findProgramAddressSync(
              [Buffer.from('metadata'), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
              METAPLEX_PROGRAM_ID
            )[0]
          );

          console.log(`Fetching metadata for ${metadataPdas.length} accounts...`);
          const metadataInfos = await connection.getMultipleAccountsInfo(metadataPdas);
          metadataInfos.forEach((info, idx) => {
            if (!info) return;
            // Metaplex Metadata Layout: Offset 1 is Update Authority (32 bytes)
            const updateAuth = new PublicKey(info.data.slice(1, 33)).toBase58();
            if (updateAuth === ACCESS_UPDATE_AUTHORITY) {
              accessMints.push(potentialMints[idx]);
            }
          });
        }
        console.log(`Confirmed Access Protocol tNFTs: ${accessMints.length}`);

        // 4. Fetch Bonds for all identified Access Mints
        // Covers BondAccount (Tag 5) and BondV2Account (Tag 11)
        const bondResults = [];
        if (accessMints.length > 0) {
          console.log('Fetching bond accounts for tNFTs...');
          const bondPromises = accessMints.map(mint => 
            connection.getProgramAccounts(ACCESS_PROGRAM_ID, {
              filters: [
                { memcmp: { offset: 1, bytes: mint.toBase58() } }
              ]
            })
          );
          const results = await Promise.all(bondPromises);
          bondResults.push(...results.flat());
        }

        const allAccounts = [...regAccounts, ...bondResults];
        console.log(`Total relevant accounts found: ${allAccounts.length}`);

        let totalStaked = 0;
        const pools = new Set();

        allAccounts.forEach(({ account }) => {
          const data = Buffer.from(account.data);
          const tag = data[0];
          let amount = 0n;
          let poolPk;

          if (tag === 3) { // StakeAccount
            amount = data.readBigUInt64LE(33);
            poolPk = new PublicKey(data.slice(41, 73));
          } else if (tag === 5) { // BondAccount (V1)
            amount = data.readBigUInt64LE(41); // total_staked
            poolPk = new PublicKey(data.slice(169, 201));
          } else if (tag === 11) { // BondV2Account
            amount = data.readBigUInt64LE(33);
            poolPk = new PublicKey(data.slice(41, 73));
          }

          if (amount > 0n) {
            totalStaked += Number(amount) / 1_000_000;
            if (poolPk) pools.add(poolPk.toBase58());
          }
        });

        console.log(`Final aggregation: ${totalStaked} ACS, ${pools.size} pools`);

        setSubscriberData({
          totalStaked: Math.floor(totalStaked),
          poolCount: pools.size,
          address: userAddress
        });
        setIsLoading(false);
        return; // Success!

      } catch (err) {
        console.error(`Fetch attempt with ${endpoint} failed:`, err);
        // Continue to next endpoint
      }
    }

    setError('Failed to fetch subscription data. Please check the address or try again later.');
    setIsLoading(false);
  };

  return { fetchSubscriberData, subscriberData, isLoading, error };
};
