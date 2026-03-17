const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');

async function checkPool(poolPk, userAddress) {
  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  let results = `\n--- POOL: ${poolPk} ---\n`;
  
  // Forever
  try {
    const res = await fetch(`${HUB_API_BASE}/supporters/${poolPk}/forever`);
    if (res.ok) {
        const data = await res.json();
        const subs = Array.isArray(data) ? data : (data.pubkeys || []);
        const match = subs.some(s => {
          const addr = typeof s === 'string' ? s : (s.pubkey || s.address || '');
          return addr.toLowerCase() === userAddress.toLowerCase();
        });
        results += `Forever: Found ${subs.length} subs. User Match: ${match}\n`;
    } else {
        results += `Forever: Error Status ${res.status}\n`;
    }
  } catch (e) {
    results += `Forever: Fetch Error ${e.message}\n`;
  }

  // Redeemable
  try {
    const res = await fetch(`${HUB_API_BASE}/supporters/${poolPk}/redeemable`);
    if (res.ok) {
        const data = await res.json();
        const subs = Array.isArray(data) ? data : (data.pubkeys || []);
        const match = subs.some(s => {
          const addr = typeof s === 'string' ? s : (s.pubkey || s.address || '');
          return addr.toLowerCase() === userAddress.toLowerCase();
        });
        results += `Redeemable: Found ${subs.length} subs. User Match: ${match}\n`;
    } else {
        results += `Redeemable: Error Status ${res.status}\n`;
    }
  } catch (e) {
    results += `Redeemable: Fetch Error ${e.message}\n`;
  }
  
  return results;
}

const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
const pools = [
    'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97',
    'EBJRxsgYMLo55nvnQJdQPAf4jVUxb39rk2cFE7WT6gS5',
    '8iDbJdPZ2suAaDVGc8NQiYPCH4XnQ53iqQJbrwQHJZ2e',
    'Dap6LDt9uehAsiPrCeAoCXLfNyWwx6ZAKXVkwAnrYtgo'
];

async function run() {
    let finalLog = "";
    for (const p of pools) {
        finalLog += await checkPool(p, user);
    }
    fs.writeFileSync('pool_check_results.txt', finalLog);
    console.log('Results written to pool_check_results.txt');
}

run();
