const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifyAllPools(userAddress) {
  const pools = [
    { name: 'Galang Ferm', pk: 'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97' },
    { name: 'Skyarina', pk: 'EBJRxsgYMLo55nvnQJdQPAf4jVUxb39rk2cFE7WT6gS5' },
    { name: 'Veryabd', pk: '8iDbJdPZ2suAaDVGc8NQiYPCH4XnQ53iqQJbrwQHJZ2e' },
    { name: 'Galang Ferm [CLOSED]', pk: 'Dap6LDt9uehAsiPrCeAoCXLfNyWwx6ZAKXVkwAnrYtgo' }
  ];

  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  
  for (const pool of pools) {
    console.log(`\n--- Pool: ${pool.name} (${pool.pk}) ---`);
    
    // Check Forever
    try {
        const fRes = await fetch(`${HUB_API_BASE}/supporters/${pool.pk}/forever`);
        const fData = await fRes.json();
        const fList = Array.isArray(fData) ? fData : (fData.pubkeys || []);
        const fMatch = fList.some(p => {
            const addr = typeof p === 'string' ? p : (p.pubkey || p.address || '');
            return addr.toLowerCase() === userAddress.toLowerCase();
        });
        console.log(`Forever Match: ${fMatch} (${fList.length} total)`);
    } catch (e) {
        console.log(`Forever Error: ${e.message}`);
    }

    // Check Redeemable
    try {
        const rRes = await fetch(`${HUB_API_BASE}/supporters/${pool.pk}/redeemable`);
        if (rRes.ok) {
            const rData = await rRes.json();
            const rList = Array.isArray(rData) ? rData : (rData.pubkeys || []);
            const rMatch = rList.some(p => {
                const addr = typeof p === 'string' ? p : (p.pubkey || p.address || '');
                return addr.toLowerCase() === userAddress.toLowerCase();
            });
            console.log(`Redeemable Match: ${rMatch} (${rList.length} total)`);
        } else {
            console.log(`Redeemable API status: ${rRes.status}`);
        }
    } catch (e) {
        console.log(`Redeemable Error: ${e.message}`);
    }
  }
}

verifyAllPools('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
