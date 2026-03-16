const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function findGalangFerm() {
  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  const userAddress = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  
  try {
    const poolsRes = await fetch(`${HUB_API_BASE}/pools?per_page=500`);
    const poolsData = await poolsRes.json();
    const pools = Object.values(poolsData).filter(p => p && p.Pubkey);
    
    const galangPools = pools.filter(p => p.Name.toLowerCase().includes('galang'));
    console.log(`Found ${galangPools.length} Galang pools:`);
    galangPools.forEach(p => console.log(`- ${p.Name}: ${p.Pubkey}`));
    
    for (const pool of galangPools) {
       console.log(`\nChecking ${pool.Name} (/forever):`);
       const fRes = await fetch(`${HUB_API_BASE}/supporters/${pool.Pubkey}/forever`);
       if (fRes.ok) {
           const fData = await fRes.json();
           const fList = Array.isArray(fData) ? fData : (fData.pubkeys || []);
           console.log(`Found ${fList.length} forever subs`);
           const found = fList.some(p => {
               const pStr = typeof p === 'string' ? p : (p.pubkey || p.address || '');
               return pStr.toLowerCase() === userAddress.toLowerCase();
           });
           console.log(`Target user in list: ${found}`);
           if (found) {
               console.log('MATCH FOUND!');
           }
       }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

findGalangFerm();
