import { Connection, PublicKey } from '@solana/web3.js';

async function listUserAccounts() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const programId = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
  const user = new PublicKey('9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk');

  console.log('Listing all potential accounts for user in program...');
  try {
    // Search for user in any position
    const accounts = await connection.getProgramAccounts(programId, {
      dataSlice: { offset: 0, length: 0 } // Just get the list/count first
    });

    console.log(`Total program accounts: ${accounts.length}`);
    
    // This is too many to scan locally. 
    // Let's use filters but broader.
    
    // Filter by dataSize? 
    // StakeV1 = 151
    // BondV2 = 90
    // Maybe there are others?
    
    const searches = [
        { name: 'Potential StakeV1', size: 151, offset: 41 },
        { name: 'Potential BondV2', size: 90, offset: 1 },
        { name: 'Potential BondV2 (Alternative)', size: 90, offset: 33 },
        { name: 'Generic Search (offset 0)', size: null, offset: 0 },
    ];

    for (const s of searches) {
        console.log(`Searching for ${s.name}...`);
        const filters = [
            { memcmp: { offset: s.offset, bytes: user.toBase58() } }
        ];
        if (s.size) filters.push({ dataSize: s.size });
        
        const res = await connection.getProgramAccounts(programId, { filters });
        console.log(`Found ${res.length} matches.`);
        if (res.length > 0) {
            // Check tags of first 5
            for (let i = 0; i < Math.min(res.length, 5); i++) {
                const full = await connection.getAccountInfo(res[i].pubkey);
                console.log(`- Match ${i} (${res[i].pubkey.toBase58()}) Tag: ${full.data[0]} Size: ${full.data.length}`);
            }
        }
    }

  } catch (err) {
    console.log('Error:', err.message);
  }
}

listUserAccounts();
