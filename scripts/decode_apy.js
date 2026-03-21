// Decodes the Access Protocol Global State Account to calculate real-time APY
// The account address is: 4vBB5HyZPUasfC4b7oTmJarE6rxLYNm6E6g9zPnAgKPC
// Access Protocol total supply is 1,000,000,000 ACS (1 billion)
// Annual inflation = 5% of total supply per year = 50,000,000 ACS/year

const https = require('https');

const GLOBAL_STATE = '4vBB5HyZPUasfC4b7oTmJarE6rxLYNm6E6g9zPnAgKPC';
const TOTAL_SUPPLY = 1_000_000_000_000_000; // 1 billion with 6 decimals
const INFLATION_RATE = 0.05; // 5% annual inflation
const ANNUAL_INFLATION = TOTAL_SUPPLY * INFLATION_RATE; // in raw units
const ANNUAL_INFLATION_ACS = ANNUAL_INFLATION / 1_000_000; // in ACS

async function rpcCall(method, params) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
    const req = https.request({
      hostname: 'api.mainnet-beta.solana.com',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': body.length }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const res = await rpcCall('getAccountInfo', [GLOBAL_STATE, { encoding: 'base64' }]);
  const accounts = res.result?.value;
  if (!accounts) { console.log('Account not found'); return; }

  const data = Buffer.from(accounts.data[0], 'base64');
  console.log('Data length:', data.length, 'bytes');

  // Try to find totalStaked across various offsets — look for values close to 3B ACS
  const targetMin = 2_900_000_000n * 1_000_000n; // 2.9B ACS in raw
  const targetMax = 3_200_000_000n * 1_000_000n; // 3.2B ACS in raw
  
  console.log('\n=== Scanning for TotalStaked (~3B ACS) ===');
  for (let i = 0; i <= data.length - 8; i += 1) {
    try {
      const val = data.readBigUInt64LE(i);
      if (val >= targetMin && val <= targetMax) {
        const acs = Number(val) / 1_000_000;
        const apy = (ANNUAL_INFLATION_ACS / acs) * 100;
        console.log(`Offset ${i}: ${(acs).toLocaleString()} ACS → APY = ${apy.toFixed(2)}%`);
      }
    } catch(e) {}
  }

  // Also check wrpc.accessprotocol.co (their custom RPC)
  console.log('\n=== Annual Inflation ACS:', ANNUAL_INFLATION_ACS.toLocaleString(), '===');
}

main().catch(console.error);
