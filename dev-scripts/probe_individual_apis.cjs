
const https = require('https');

const addresses = [
    "9tH2HSxraombZ31koRL51Lp761pRsQDwn1BFYErxuJRi", // Budds
    "EfSziQLP8arMC4e47RkaFMsxbyPXVth44r88fWJnoW", // Screenshot 2
];

async function checkUrl(url) {
    return new Promise((resolve) => {
        console.log(`Checking ${url}...`);
        https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
            let body = "";
            res.on("data", (d) => body += d);
            res.on("end", () => {
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log("Success! Body:", body.substring(0, 500));
                }
                resolve();
            });
        }).on('error', (e) => {
            console.error(`Error: ${e.message}`);
            resolve();
        });
    });
}

async function run() {
    for (const addr of addresses) {
        await checkUrl(`https://go-api.accessprotocol.co/creators/${addr}`);
        await checkUrl(`https://go-api.accessprotocol.co/hub/creator/${addr}`);
    }
}

run();
