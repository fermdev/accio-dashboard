
const { PublicKey } = require('@solana/web3.js');

const ACCESS_PROGRAM_ID = new PublicKey('6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup');

function derive(poolStr) {
    try {
        const pool = new PublicKey(poolStr);
        const [hubPk] = PublicKey.findProgramAddressSync(
            [Buffer.from("hub"), pool.toBuffer()],
            ACCESS_PROGRAM_ID
        );
        return hubPk.toString();
    } catch (e) {
        return null;
    }
}

const pools = [
    "9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi", // Heyitsbudds
    "EfSziQLP8arMC4e47RkaFMsxbyPXVth44r88fWJnoW",
    "686mS957pqvf8pR5v79ochnIcCUhBN2PiaX7U8ZMgzoA"
];

pools.forEach(p => {
    const hub = derive(p);
    console.log(`Pool: ${p} -> Hub: ${hub}`);
});
