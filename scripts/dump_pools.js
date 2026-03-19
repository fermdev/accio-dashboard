import fs from 'fs';
async function run() {
  const res = await fetch('https://go-api.accessprotocol.co/pools');
  const pools = await res.json();
  fs.writeFileSync('pools_dump.json', JSON.stringify(pools[0], null, 2));
}
run();
