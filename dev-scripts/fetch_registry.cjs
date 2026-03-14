
const https = require('https');
const fs = require('fs');

async function fetchRegistry() {
    console.log("Fetching creator registry...");
    const options = {
        hostname: 'go-api.accessprotocol.co',
        path: '/hub/search?sort=featured&page=0&per_page=500',
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://hub.accessprotocol.co',
            'Referer': 'https://hub.accessprotocol.co/'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            if (res.statusCode === 200) {
                fs.writeFileSync('creators_registry.json', body);
                console.log(`Saved ${body.length} bytes to creators_registry.json`);
                try {
                    const parsed = JSON.parse(body);
                    console.log(`Found ${parsed.data ? parsed.data.length : 0} creators.`);
                } catch (e) {
                    console.error("Failed to parse JSON.");
                }
            } else {
                console.error(`Error: Received status ${res.statusCode}`);
                console.error(body);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Request failed: ${e.message}`);
    });
    req.end();
}

fetchRegistry();
