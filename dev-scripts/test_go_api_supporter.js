const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkGoApiSupporterData() {
    const poolPubkey = 'B8FDRu5N8K7p8uP5N4yQ7pU8N4yQ7pU8N4yQ7pU8N4yQ'; // Just a sample pool
    // Actually, I'll use the AlphaCoded pool since I know it has Forever subs
    const ALPHAY_POOL = 'B1m7V3vK4NUX8ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRB'; // I'll search for this
    
    // Let's get the pools first
    const poolsRes = await fetch('https://go-api.accessprotocol.co/pools?order=supporters&per_page=10');
    const pools = await poolsRes.json();
    const firstPool = Object.values(pools)[0];
    
    console.log(`Testing pool: ${firstPool.Name} (${firstPool.Pubkey})`);
    
    const supRes = await fetch(`https://go-api.accessprotocol.co/supporters/${firstPool.Pubkey}/locked?per_page=50`, {
        headers: {
            'Origin': 'https://hub.accessprotocol.co',
            'Referer': 'https://hub.accessprotocol.co/',
            'Accept': 'application/json'
        }
    });
    
    const data = await supRes.json();
    const supporters = Array.isArray(data) ? data : (data.supporters || []);
    
    console.log('Sample supporter data:');
    if (supporters.length > 0) {
        console.log(JSON.stringify(supporters[0], null, 2));
    } else {
        console.log('No supporters found for this pool');
    }
}

checkGoApiSupporterData();
