import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';

async function getGlobalState() {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const pubkey = new PublicKey('4vBB5HyZPUasfC4b7oTmJarE6rxLYNm6E6g9zPnAgKPC');
    const info = await connection.getAccountInfo(pubkey);
    
    if (info) {
        console.log("Data length:", info.data.length);
        const data = Buffer.from(info.data);
        // Access Protocol GlobalState usually has total_staked at some offset
        // Let's look for big numbers
        for (let i = 0; i < data.length - 8; i += 8) {
            try {
                const val = data.readBigUInt64LE(i);
                if (val > 1000000000000n) { // Over 1M ACS
                    console.log(`Offset ${i}: ${val.toString()} (${Number(val) / 1000000} ACS)`);
                }
            } catch (e) {}
        }
    } else {
        console.log("Account not found");
    }
}

getGlobalState();
