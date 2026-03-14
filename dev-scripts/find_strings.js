
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_ENDPOINT = 'https://solana.publicnode.com';
const poolAddress = '9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi';

async function findStrings() {
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');
    const pubkey = new PublicKey(poolAddress);
    const accountInfo = await connection.getAccountInfo(pubkey);

    if (!accountInfo) {
        console.log('Account not found');
        return;
    }

    const data = accountInfo.data;
    console.log('Searching in', data.length, 'bytes...');

    for (let i = 0; i < data.length - 4; i++) {
        // Look for printable ASCII strings
        let j = i;
        let str = '';
        while (j < data.length && data[j] >= 32 && data[j] <= 126) {
            str += String.fromCharCode(data[j]);
            j++;
        }
        if (str.length > 5) {
            console.log(`Found string at offset ${i}: "${str}"`);
            i = j; // skip
        }
    }
}

findStrings();
