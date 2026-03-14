
const { Connection, PublicKey } = require('@solana/web3.js');

const PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const RPC_ENDPOINT = 'https://solana.publicnode.com';

const pools = [
    '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi', // Budds
    '3VmtjP2gjMKgzQosB59AEc6wwNCf9AsYEL',           // Screen 1
    'EBJRxsgyMLo55nvnQJdQPAF4jVUxb39rkz'            // Screen 2
];

async function checkMetadata() {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    for (const p of pools) {
        console.log(`\n--- Pool: ${p} ---`);
        try {
            const poolPk = new PublicKey(p);
            // Try different metadata seeds
            const seeds = [
                [Buffer.from("metadata"), poolPk.toBuffer()],
                [Buffer.from("pool-metadata"), poolPk.toBuffer()],
                [Buffer.from("publisher-metadata"), poolPk.toBuffer()]
            ];

            for (const s of seeds) {
                const [meta] = PublicKey.findProgramAddressSync(s, PROGRAM_ID);
                const info = await connection.getAccountInfo(meta);
                if (info) {
                    console.log(`Found Metadata account at ${meta.toString()} with seed ${s[0].toString()}`);
                    console.log(`Data (strings):`, info.data.toString('utf-8').replace(/[^\x20-\x7E]/g, '.'));
                }
            }
        } catch (e) {
             console.error(`Error: ${e.message}`);
        }
    }
}

checkMetadata();
