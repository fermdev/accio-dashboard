
const { Connection, PublicKey } = require('@solana/web3.js');

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');
const BUDS_POOL = new PublicKey('9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi');

async function checkHub(pool) {
    console.log(`Checking Hub for Pool: ${pool.toString()}`);
    const [hubPk] = PublicKey.findProgramAddressSync(
        [Buffer.from("hub"), pool.toBuffer()],
        ACCESS_PROGRAM_ID
    );
    console.log(`Derived Hub: ${hubPk.toString()}`);

    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const info = await connection.getAccountInfo(hubPk);

    if (info) {
        console.log(`Hub Account Data Found (${info.data.length} bytes)`);
        const data = info.data;
        let foundStrings = [];
        let currentString = "";
        for (let i = 0; i < data.length; i++) {
            const charCode = data[i];
            if (charCode >= 32 && charCode <= 126) {
                currentString += String.fromCharCode(charCode);
            } else {
                if (currentString.length >= 3) {
                    foundStrings.push(currentString);
                }
                currentString = "";
            }
        }
        console.log("Found Strings:", foundStrings);
    } else {
        console.log("Hub Account NOT found on-chain.");
    }
}

async function run() {
    try {
        await checkHub(BUDS_POOL);
    } catch(e) {
        console.error("Error:", e.message);
    }
}

run();
