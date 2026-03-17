const { Connection, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const USER_WALLET = new PublicKey('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6'); // The one from the screenshot
const REGISTRY_PATH = 'c:/Users/ASUS Vivobook/.gemini/antigravity/scratch/acscard/src/data/creator_registry.json';

async function testGmaSync() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const poolAddresses = Object.keys(registry);
  
  console.log(`Scanning ${poolAddresses.length} pools for wallet ${USER_WALLET.toBase58()}...`);
  
  const pdaList = poolAddresses.map(poolAddr => {
    try {
      const poolPk = new PublicKey(poolAddr);
      const [pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('stake_account'), poolPk.toBuffer(), USER_WALLET.toBuffer()],
        ACCESS_PROGRAM_ID
      );
      return pda;
    } catch (e) {
      return null;
    }
  }).filter(pda => pda !== null);

  console.log(`Derived ${pdaList.length} PDAs. Fetching in chunks...`);
  
  let totalStaked = 0n;
  let activePools = 0;

  for (let i = 0; i < pdaList.length; i += 100) {
    const chunk = pdaList.slice(i, i + 100);
    const accountInfos = await connection.getMultipleAccountsInfo(chunk);
    
    accountInfos.forEach(info => {
      if (info && info.data) {
        // StakeAccount layout (Anchor):
        // Offset 8: Staker (32)
        // Offset 40: Pool (32)
        // Offset 72: Amount (8)
        // Offset 80: Lock State...
        if (info.data.length >= 80) {
          const amount = info.data.readBigUInt64LE(72);
          if (amount > 0n) {
            totalStaked += amount;
            activePools++;
          }
        }
      }
    });
  }

  console.log(`\n--- RESULTS for ${USER_WALLET.toBase58()} ---`);
  console.log(`Active Pools: ${activePools}`);
  console.log(`Total Staked: ${Number(totalStaked / 1000000n)} ACS`);
}

testGmaSync();
