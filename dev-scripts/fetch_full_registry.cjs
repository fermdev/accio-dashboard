
const https = require('https');
const fs = require('fs');
const path = require('path');

const url = "https://go-api.accessprotocol.co/pools?order=featured&page=0&per_page=500";

async function fetchRegistry() {
    console.log(`Fetching registry from ${url}...`);
    
    https.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Origin": "https://hub.accessprotocol.co",
            "Referer": "https://hub.accessprotocol.co/"
        }
    }, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => {
            try {
                const data = JSON.parse(body);
                const registry = {};
                
                // The API seems to return an object with a 'data' array or just an array
                const items = Array.isArray(data) ? data : (data.data || []);
                
                console.log(`Fetched ${items.length} items.`);
                
                items.forEach(item => {
                    const name = item.Name || item.name;
                    const pubkey = item.Pubkey || item.pubkey;
                    const pool = item.Pool || item.pool;
                    const slug = item.Slug || item.slug;
                    
                    if (name) {
                        if (pubkey) registry[pubkey] = name;
                        if (pool) registry[pool] = name;
                        if (slug) registry[slug] = name;
                    }
                });

                // Add some known overrides or missing ones if found earlier
                // From browser extract: 
                // "Fxh4hDFHJuTfD3Eq4en36dTk8QvbsSMoTE5Y2hVX3qVt": "The Block"
                // "EfSziQLP8arMC4e47RkaFMsxbyPXVth44r88fWJnoW": "Bourgeois"
                
                const count = Object.keys(registry).length;
                console.log(`Processed ${count} unique address-to-name mappings.`);
                
                const targetPath = path.join(process.cwd(), 'src', 'data', 'creator_registry.json');
                fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                fs.writeFileSync(targetPath, JSON.stringify(registry, null, 2));
                
                console.log(`Registry saved to ${targetPath}`);
                
            } catch (err) {
                console.error("Failed to parse registry data:", err.message);
                console.log("Response Body (first 500 chars):", body.substring(0, 500));
            }
        });
    }).on('error', (err) => {
        console.error("Fetch error:", err.message);
    });
}

fetchRegistry();
