
const https = require('https');
const fs = require('fs');

async function probe() {
    console.log('Probing creator search API using built-in https module...');
    
    const data = JSON.stringify({
        sort: 'featured',
        page: 0,
        per_page: 100
    });

    const options = {
        hostname: 'go-api.accessprotocol.co',
        port: 443,
        path: '/hub/search',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        let responseBody = '';

        res.on('data', (d) => {
            responseBody += d;
        });

        res.on('end', () => {
            console.log('Response received.');
            try {
                const parsed = JSON.parse(responseBody);
                fs.writeFileSync('creators_list.json', JSON.stringify(parsed, null, 2));
                console.log('Data saved to creators_list.json');
                if (parsed.data && Array.isArray(parsed.data)) {
                    console.log(`Found ${parsed.data.length} creators.`);
                }
            } catch (e) {
                console.log('Failed to parse JSON response.');
                console.log('Raw response:', responseBody.substring(0, 500));
            }
        });
    });

    req.on('error', (error) => {
        console.error('Request Error:', error);
    });

    req.write(data);
    req.end();
}

probe();
