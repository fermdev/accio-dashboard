
const https = require('https');
const fs = require('fs');

const githubUrl = "https://raw.githubusercontent.com/Access-Labs-Inc/access-protocol-pool-list/main/pools.json";

function download() {
    console.log(`Downloading from ${githubUrl}...`);
    https.get(githubUrl, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode !== 200) {
            console.error(`Failed: Status ${res.statusCode}`);
            return;
        }
        let body = "";
        res.on("data", (d) => body += d);
        res.on("end", () => {
            fs.writeFileSync("github_pools.json", body);
            console.log(`Saved ${body.length} bytes to github_pools.json`);
            try {
                const data = JSON.parse(body);
                console.log("JSON is valid.");
                // Print first 5
                if (Array.isArray(data)) {
                  data.slice(0, 5).forEach(p => console.log(`${p.name}: ${p.address}`));
                } else if (data.pools) {
                   data.pools.slice(0, 5).forEach(p => console.log(`${p.name}: ${p.address}`));
                }
            } catch (e) {
                console.error("Invalid JSON content.");
            }
        });
    }).on('error', (e) => {
        console.error(`Request error: ${e.message}`);
    });
}

download();
