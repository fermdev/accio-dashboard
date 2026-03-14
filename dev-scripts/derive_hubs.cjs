
const { PublicKey } = require('@solana/web3.js');
const PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

const pools = [
    '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi', // Budds
    '3VmtjP2gjMKgzQosB59AEc6wwNCf9AsYEL',           // Screen 1
    'EBJRxsgyMLo55nvnQJdQPAF4jVUxb39rkz'            // Screen 2
];

pools.forEach(p => {
    try {
        const poolPk = new PublicKey(p);
        const [hub] = PublicKey.findProgramAddressSync(
            [Buffer.from('hub'), poolPk.toBuffer()],
            PROGRAM_ID
        );
        console.log(`${p} -> ${hub.toString()}`);
    } catch (e) {
        console.error(`Error with ${p}: ${e.message}`);
    }
});
