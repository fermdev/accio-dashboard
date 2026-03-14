
const { Connection, PublicKey } = require('@solana/web3.js');

const RPC_ENDPOINT = 'https://solana.publicnode.com';
const pools = [
    '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi', // Budds
    '3VmtjP2gjMKgzQosB59AEc6wwNCf9AsYEL',           // Screen 1
    'EBJRxsgyMLo55nvnQJdQPAF4jVUxb39rkz'            // Screen 2
];

async function checkMints() {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    
    for (const poolStr of pools) {
        console.log(`\n--- Analyzing Pool: ${poolStr} ---`);
        try {
            const poolPk = new PublicKey(poolStr);
            const info = await connection.getAccountInfo(poolPk);
            if (!info) continue;

            const data = info.data;
            // Check potential pubkeys at various offsets
            // Common offsets: 8, 40, 72, 104... (8-byte discriminator)
            for (let i = 8; i <= data.length - 32; i += 32) {
                const pk = new PublicKey(data.slice(i, i + 32));
                const pkStr = pk.toString();
                if (pkStr === '11111111111111111111111111111111') continue;
                
                // Check if it looks like a Mint
                const mintInfo = await connection.getAccountInfo(pk);
                if (mintInfo && mintInfo.data.length === 82) { // Standard Token Mint size
                    console.log(`Found Potential Mint at offset ${i}: ${pkStr}`);
                    
                    // Try to find Metaplex metadata for this mint
                    const [meta] = PublicKey.findProgramAddressSync(
                        [
                            Buffer.from('metadata'),
                            new PublicKey('metaqbxxUerdqVSvADuM996mAadGomJ3kzybvvB21xN').toBuffer(),
                            pk.toBuffer()
                        ],
                        new PublicKey('metaqbxxUerdqVSvADuM996mAadGomJ3kzybvvB21xN')
                    );
                    const metaInfo = await connection.getAccountInfo(meta);
                    if (metaInfo) {
                        console.log(`  -> Found Metaplex Metadata!`);
                        // Extract name from metadata (it's at fixed offsets)
                        const name = metaInfo.data.slice(65, 65 + 32).toString('utf-8').trim().replace(/\0/g, '');
                        console.log(`  -> Creator Name: ${name}`);
                    }
                }
            }
        } catch (e) {
            console.error(`Error with ${poolStr}: ${e.message}`);
        }
    }
}

checkMints();
