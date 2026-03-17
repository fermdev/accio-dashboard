const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function checkPool(poolPk, userAddress) {
  const HUB_API_BASE = 'https://go-api.accessprotocol.co';
  const url = `${HUB_API_BASE}/supporters/${poolPk}/forever`;
  console.log(`Checking: ${url}`);
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Error Status: ${res.status}`);
      return;
    }
    const data = await res.json();
    const subs = Array.isArray(data) ? data : (data.pubkeys || []);
    console.log(`Total forever subs: ${subs.length}`);
    const match = subs.some(s => {
      const addr = typeof s === 'string' ? s : (s.pubkey || s.address || '');
      return addr.toLowerCase() === userAddress.toLowerCase();
    });
    console.log(`User Match: ${match}`);
    if (match) {
        console.log(`FOUND IN ${poolPk}`);
    }
  } catch (e) {
    console.log(`Fetch Error: ${e.message}`);
  }
}

// User: HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6
const user = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
const pools = [
    'o5wvgWKBFn5Q5u82mvJuqW9DpMgmCnxQBMCsugvJg97', // Galang
    'EBJRxsgYMLo55nvnQJdQPAf4jVUxb39rk2cFE7WT6gS5', // Skyarina
    '8iDbJdPZ2suAaDVGc8NQiYPCH4XnQ53iqQJbrwQHJZ2e', // Veryabd
    'Dap6LDt9uehAsiPrCeAoCXLfNyWwx6ZAKXVkwAnrYtgo'  // Galang CLOSED
];

async function run() {
    for (const p of pools) {
        await checkPool(p, user);
    }
}

run();
