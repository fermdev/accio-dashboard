
const https = require('https');
const fs = require('fs');

const url = "https://hub.accessprotocol.co/en/discover";

async function scrape() {
    console.log(`Scraping ${url}...`);
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let body = "";
        res.on("data", (d) => body += d);
        res.on("end", () => {
            // Find ALL 44-char base58 strings followed by a name or near a name
            // Hub names usually appear as "name":"..." or similar in the JSON state
            const matches = body.matchAll(/"name":"([^"]+)","pubkey":"([^"]+)"/g);
            let registry = {};
            for (const match of matches) {
                const name = match[1];
                const pubkey = match[2];
                registry[pubkey] = name;
            }

            // Also try owner/pool pattern
            const poolMatches = body.matchAll(/"pool":"([^"]+)","name":"([^"]+)"/g);
            for (const match of poolMatches) {
                const pubkey = match[1];
                const name = match[2];
                registry[pubkey] = name;
            }

            console.log(`Found ${Object.keys(registry).length} creators.`);
            if (Object.keys(registry).length > 0) {
                fs.writeFileSync("scraped_creators.json", JSON.stringify(registry, null, 2));
                console.log("Saved to scraped_creators.json");
                // Print a few
                console.log(Object.entries(registry).slice(0, 10));
            } else {
                console.log("No matches found. Dumping first 2000 chars of body:");
                console.log(body.substring(0, 2000));
            }
        });
    });
}

scrape();
