const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const w1 = 'CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn'; // Works
const w2 = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6'; // User's broken wallet

const h = { 'Origin': 'https://hub.accessprotocol.co' };

async function test(wallet) {
  const endpoints = [
    `https://go-api.accessprotocol.co/supporters/staking-summary/${wallet}`,
    `https://go-api.accessprotocol.co/supporters/locked?user_pubkey=${wallet}`,
    `https://go-api.accessprotocol.co/supporters/forever?user_pubkey=${wallet}`,
    `https://go-api.accessprotocol.co/supporters/redeemable?user_pubkey=${wallet}`,
    `https://go-api.accessprotocol.co/supporters/${wallet}`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/locked`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/forever`,
    `https://go-api.accessprotocol.co/supporters/${wallet}/redeemable`,
    `https://api.accessprotocol.co/api/v1/supporters/${wallet}/staking-info`
  ];

  console.log(`\n=== Testing Wallet: ${wallet} ===`);
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: h });
      if (res.ok) {
        const text = await res.text();
        console.log(`OK! ${url} -> ${text.slice(0, 100)}...`);
      } else {
        console.log(`FAIL ${res.status}: ${url}`);
      }
    } catch (e) {
      console.log(`ERR: ${url} -> ${e.message}`);
    }
  }
}

(async () => {
  await test(w1);
  await test(w2);
})();
