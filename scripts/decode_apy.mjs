// Access Protocol APY Calculation
// Uses the pools API to sum TotalStaked, then applies 5% annual inflation formula
// APY = Annual Inflation / Total Protocol Staked × 100

// Access Protocol facts:
// Total supply: 1,000,000,000 ACS (with 6 decimals = 1_000_000_000_000_000 raw)
// Annual inflation: ~5% of total supply = 50,000,000 ACS/year

const TOTAL_SUPPLY_ACS = 1_000_000_000;  // 1 billion ACS
const ANNUAL_INFLATION_PERCENT = 0.05;
const ANNUAL_INFLATION_ACS = TOTAL_SUPPLY_ACS * ANNUAL_INFLATION_PERCENT; // 50,000,000

async function calculateLiveAPY() {
  const res = await fetch('https://go-api.accessprotocol.co/pools');
  const pools = await res.json();
  
  let totalStakedRaw = 0;
  pools.forEach(p => {
    if (p.TotalStaked) totalStakedRaw += Number(p.TotalStaked);
  });
  
  const totalStakedACS = totalStakedRaw / 1_000_000; // convert from raw (6 decimals)
  const apy = (ANNUAL_INFLATION_ACS / totalStakedACS) * 100;
  
  console.log('Total Pools:', pools.length);
  console.log('Total Protocol Staked:', totalStakedACS.toLocaleString(), 'ACS');
  console.log('Annual Inflation:', ANNUAL_INFLATION_ACS.toLocaleString(), 'ACS');
  console.log('Calculated APY:', apy.toFixed(2) + '%');
  console.log('\nHub shows 28.66% — close match?', Math.abs(apy - 28.66) < 2 ? 'YES ✓' : 'NO (formula may differ)');
}

calculateLiveAPY().catch(console.error);
