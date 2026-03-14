
import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const pools = [
    '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi', // Budds
    '3VmtjP2gjMKgzQosB59AEc6wwNCf9AsYEL',           // Screen 1
    'EBJRxsgyMLo55nvnQJdQPAF4jVUxb39rkz'            // Screen 2
];

pools.forEach(poolStr => {
    const pool = new PublicKey(poolStr);
    const [hub, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from("hub"), pool.toBuffer()],
        PROGRAM_ID
    );
    console.log(`Pool: ${poolStr}`);
    console.log(`Derived Hub: ${hub.toString()}`);
    console.log(`Short Hub: ${hub.toString().slice(0, 4)}...${hub.toString().slice(-4)}`);
    console.log('---');
});
