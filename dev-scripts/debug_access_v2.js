
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_ENDPOINT = 'https://solana.publicnode.com';
const poolAddress = '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi'; // heyitsbudds
const PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

async function debugPool() {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const pubkey = new PublicKey(poolAddress);
    const accountInfo = await connection.getAccountInfo(pubkey);

    if (!accountInfo) {
        console.log('Account not found');
        return;
    }

    const data = accountInfo.data;
    console.log('Account Data Length:', data.length);
    
    // Check offsets for potential values
    // heyitsbudds Hub: 4.1M Locked, 598 Supporters, 2.2K Min Lock
    
    // 1. Min Lock (likely u64 at 8 based on IDL)
    const minLockRaw = data.readBigUInt64LE(8);
    console.log('Min Lock (offset 8):', Number(minLockRaw) / 1e6, 'ACS');

    // 2. Total Staked (offset 16)
    const totalStakedRaw = data.readBigUInt64LE(16);
    console.log('Total Staked (offset 16):', Number(totalStakedRaw) / 1e6, 'ACS');

    // 3. Search for 598 (Supporters) 
    for (let i = 0; i <= data.length - 4; i++) {
        if (data.readUInt32LE(i) === 598) {
            console.log(`Found 598 (u32) at offset: ${i}`);
        }
    }

    // Search for strings
    const searchTerms = ['Budds', 'budds', 'HEY', 'hey', 'HUB', 'hub'];
    
    searchTerms.forEach(term => {
        const idx = data.indexOf(term);
        if (idx !== -1) {
            console.log(`Found "${term}" at offset: ${idx}`);
            // Print surrounding data
            console.log(`Data at offset ${idx}:`, data.slice(idx, idx + 32).toString());
        }
    });

    // Check for u8-prefixed strings (Anchor style)
    // Try to find any string-like data
    for (let i = 0; i < data.length - 20; i++) {
        const len = data.readUInt32LE(i);
        if (len > 3 && len < 50) {
            const str = data.slice(i + 4, i + 4 + len).toString();
            if (/^[a-zA-Z0-9_-]+$/.test(str)) {
                console.log(`Potential string at ${i} (len ${len}): "${str}"`);
            }
        }
    }

    // Check first 100 bytes for anything else
    console.log('First 64 bytes (hex):', data.slice(0, 64).toString('hex'));
}

debugPool();
