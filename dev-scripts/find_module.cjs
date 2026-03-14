
const urls = [
    "https://hub.accessprotocol.co/_next/static/chunks/webpack-3791109a1da6d2c4.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/87c73c54-044106598b062423.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/59c6eb5a-de4f7698ec77baf1.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/1183-86546ea2a19f6f12.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/main-app-f2a280cfe6b035cc.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/2c344fa8-7686d4c5cbdb9007.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/933-5d54e480c4db0517.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/1656-74cf00e6fc08e222.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/7012-0f3546fd2d5234c4.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/265-b08ee70211dd4799.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/cd24890f-5e83e38e66ca337a.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/2344-ef3b84b988333adb.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/3249-4d833784cd2a4eb8.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/3520-bfdf273f2cdae87f.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/5577-815c4f10334dab41.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/525-80d9396ce25e0ad8.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/5237-f7c9a2ec5f268469.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/6106-866569118c255be5.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/5333-bb7347a373c213a6.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj",
    "https://hub.accessprotocol.co/_next/static/chunks/2208-065c313b16e59607.js?dpl=dpl_FFfT75PBvXDecuqm5nBe2Jw82MYj"
];

const https = require('https');
const fs = require('fs');

async function downloadAndSearch() {
    for (const url of urls) {
        console.log(`Checking ${url}...`);
        try {
            const content = await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    let body = '';
                    res.on('data', (d) => body += d);
                    res.on('end', () => resolve(body));
                }).on('error', reject);
            });
            if (content.includes('98237:')) {
                console.log(`FOUND 98237 in ${url}`);
                // Extract a bit of context around 98237:
                const index = content.indexOf('98237:');
                console.log('Context:', content.substring(index, index + 2000));
                fs.writeFileSync('module_98237.js', content.substring(index, index + 20000));
                break;
            }
        } catch (e) {
            console.error(`Error checking ${url}: ${e.message}`);
        }
    }
}

downloadAndSearch();
