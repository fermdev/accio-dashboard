const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function findUserStakes(wallet) {
  const bases = [
    'https://go-api.accessprotocol.co/supporters/locked',
    'https://go-api.accessprotocol.co/supporters/forever',
    'https://go-api.accessprotocol.co/supporters/redeemable'
  ];
  const params = [
    'user_pubkey',
    'user_address',
    'staker_pubkey',
    'address',
    'pubkey'
  ];

  const headers = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/'
  };

  console.log(`\n--- Exhaustive User Scan for ${wallet} ---`);

  for (const b of bases) {
    for (const p of params) {
      const url = `${b}?${p}=${wallet}&page=1&page_size=100`;
      try {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.total > 0 || json.supporters_count > 0) {
            console.log(`[FOUND!] URL: ${url}`);
            console.log(`  Result: Total ${json.total}, Count ${json.supporters_count}`);
          } else {
             // console.log(`  Empty: ${url}`);
          }
        }
      } catch (e) {}
    }
  }
}

(async () => {
  await findUserStakes('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
  await findUserStakes('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
})();
