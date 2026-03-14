
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
    console.log('Account Owner:', accountInfo.owner.toString());
    console.log('Account Data Length:', data.length);
    console.log('Discriminator (hex):', data.slice(0, 8).toString('hex'));

    const hex = data.toString('hex');
    console.log('Raw Data Hex (start):', hex.slice(0, 200));

    // Search for HeyItsBudds
    const namePos = data.indexOf('HeyItsBudds');
    console.log('HeyItsBudds found at:', namePos);

    const namePosSlug = data.indexOf('heyitsbudds');
    console.log('heyitsbudds found at:', namePosSlug);

    // Search for the 4.1M value bitwise
    // 4,100,000 * 1,000,000 = 4,100,000,000,000
    // Hex: 0x03bbdd94a400
    // LE: 00 a4 94 dd bb 03 00 00
    const targetVal = 4100000n * 1000000n;
    console.log('Target Value (hex):', targetVal.toString(16));

    for (let i = 0; i <= data.length - 8; i++) {
        const val = data.readBigUInt64LE(i);
        if (val > 1000000n * 1000000n && val < 10000000n * 1000000n) {
             console.log(`Found value in range [1M, 10M] at ${i}:`, val.toString(), `(adj: ${Number(val)/1e6})`);
        }
    }
}

debugPool();
