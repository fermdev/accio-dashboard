// Diagnostic script to figure out the APY formula
const pools = require('./pools_dump.json');

let totalStakedRaw = 0n;
let count = 0;
pools.forEach(p => {
  if (p.TotalStaked && Number(p.TotalStaked) > 0) {
    totalStakedRaw += BigInt(p.TotalStaked);
    count++;
  }
});

const totalStakedACS = Number(totalStakedRaw) / 1_000_000;
console.log('Active pools (with staked):', count, '/ total:', pools.length);
console.log('Total Protocol Staked:', totalStakedACS.toLocaleString(), 'ACS');
console.log('Total Protocol Staked (raw):', totalStakedRaw.toString());

// 967M ACS/month = 11.6B/year
// Total supply ~89.91B ACS
const monthlyIncentives = 967_000_000;
const annualIncentives = monthlyIncentives * 12;
const apy_with_monthly = (annualIncentives / totalStakedACS) * 100;
console.log('\n=== Using 967M/month (11.6B/year) incentives ===');
console.log('Annual =', annualIncentives.toLocaleString(), 'ACS');
console.log('APY =', apy_with_monthly.toFixed(2) + '%');

// 5% of total supply
const totalSupply = 89_910_000_000;
const annualInflation5pct = totalSupply * 0.05;
const apy_5pct = (annualInflation5pct / totalStakedACS) * 100;
console.log('\n=== Using 5% of 89.9B total supply ===');
console.log('Annual =', annualInflation5pct.toLocaleString(), 'ACS');
console.log('APY =', apy_5pct.toFixed(2) + '%');

// Reverse-engineer: what annual emission gives 28.66%?
const targetAPY = 28.66;
const requiredEmission = totalStakedACS * (targetAPY / 100);
console.log('\n=== To get 28.66% APY, annual emission must be ===');
console.log(requiredEmission.toLocaleString(), 'ACS/year');
console.log((requiredEmission / 12).toLocaleString(), 'ACS/month');
