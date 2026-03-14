
const https = require('https');
const fs = require('fs');

const url = "https://hub.accessprotocol.co/en/discover";

function download() {
    console.log(`Downloading ${url}...`);
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let body = "";
        res.on("data", (d) => body += d);
        res.on("end", () => {
            console.log("Download complete. Searching for __NEXT_DATA__...");
            const match = body.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
            if (match) {
                try {
                    const json = JSON.parse(match[1]);
                    const queries = json.props.pageProps.initialState.queries;
                    const searchData = queries.find(q => q.queryKey[0] === "search" || q.queryKey.includes("featured"))?.state.data;
                    
                    if (searchData && searchData.data) {
                        const registry = {};
                        searchData.data.forEach(c => {
                            if (c.pubkey) registry[c.pubkey] = c.name;
                            if (c.pool) registry[c.pool] = c.name;
                        });
                        fs.writeFileSync("creator_registry.json", JSON.stringify(registry, null, 2));
                        console.log(`Success! Saved ${Object.keys(registry).length} creators to creator_registry.json`);
                    } else if (searchData && Array.isArray(searchData)) {
                         const registry = {};
                         searchData.forEach(c => {
                             if (c.pubkey) registry[c.pubkey] = c.name;
                             if (c.pool) registry[c.pool] = c.name;
                         });
                         fs.writeFileSync("creator_registry.json", JSON.stringify(registry, null, 2));
                         console.log(`Success! Saved ${Object.keys(registry).length} creators to creator_registry.json`);
                    } else {
                        console.log("Could not find search data in __NEXT_DATA__.");
                        // Try aggressive regex match on the whole body for name/pubkey pairs
                        const registry = {};
                        const matches = body.matchAll(/"name":"([^"]+)","pubkey":"([^"]+)"/g);
                        for (const m of matches) { registry[m[2]] = m[1]; }
                        const matches2 = body.matchAll(/"name":"([^"]+)","pool":"([^"]+)"/g);
                        for (const m of matches2) { registry[m[2]] = m[1]; }
                        
                        if (Object.keys(registry).length > 0) {
                            fs.writeFileSync("creator_registry.json", JSON.stringify(registry, null, 2));
                            console.log(`Fallback Success! Saved ${Object.keys(registry).length} creators.`);
                        } else {
                            console.log("No matches found in fallback either.");
                        }
                    }
                } catch (e) {
                    console.error("Failed to parse JSON:", e.message);
                }
            } else {
                console.log("No __NEXT_DATA__ tag found.");
            }
        });
    }).on('error', (e) => {
        console.error("Request failed:", e.message);
    });
}

download();
