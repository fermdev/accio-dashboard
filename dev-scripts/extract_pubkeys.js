
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_ENDPOINT = 'https://solana.publicnode.com';
const pools = [
    '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi', // Budds
    '3VmtjP2gjMKgzQosB59AEc6wwNCf9AsYEL',           // Screen 1
    'EBJRxsgyMLo55nvnQJdQPAF4jVUxb39rkz'            // Screen 2
];

async function extractPubkeys() {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    for (const poolAddress of pools) {
        console.log(`--- Analyzing Pool: ${poolAddress} ---`);
        const pubkey = new PublicKey(poolAddress);
        const accountInfo = await connection.getAccountInfo(pubkey);

        if (!accountInfo) {
            console.log('Account not found');
            continue;
        }

        const data = accountInfo.data;
        console.log('Searching in', data.length, 'bytes...');

        for (let i = 0; i <= data.length - 32; i += 1) {
            try {
                const pk = new PublicKey(data.slice(i, i + 32));
                if (await PublicKey.isOnCurve(pk.toBytes())) {
                    const pkStr = pk.toString();
                    if (pkStr !== '11111111111111111111111111111111' && !pkStr.includes('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup')) {
                         console.log(`Offset ${i}: ${pkStr}`);
                    }
                }
            } catch (e) {}
        }
    }
}

extractPubkeys();
