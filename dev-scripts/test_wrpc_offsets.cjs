const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRpc(walletAddr) {
  const url = 'https://wrpc.accessprotocol.co/';
  const programId = '6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup';
  
  const scan = async (offset) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getProgramAccounts',
        params: [
          programId,
          {
            filters: [{ memcmp: { offset, bytes: walletAddr } }],
            encoding: 'base64'
          }
        ]
      })
    });
    const json = await res.json();
    return json.result || [];
  };

  console.log(`--- Testing Wallet: ${walletAddr} ---`);
  const [off1, off8] = await Promise.all([scan(1), scan(8)]);
  console.log(`Offset 1 (Legacy): Found ${off1.length} accounts`);
  console.log(`Offset 8 (New): Found ${off8.length} accounts`);
  
  const all = [...off1, ...off8];
  let total = 0n;
  all.forEach(a => {
    const data = Buffer.from(a.account.data[0], 'base64');
    if (data.length >= 73) {
      // Offset 1 accounts usually have amount at 33
      // Offset 8 accounts might have it elsewhere
      const amt33 = data.readBigUInt64LE(33);
      if (amt33 > 0n) total += amt33;
    }
  });
  console.log(`Total Staked Detectable at @33: ${Number(total)/1000000} ACS`);
}

(async () => {
  await testRpc('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
  await testRpc('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
})();
