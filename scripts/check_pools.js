async function run() {
  const res = await fetch('https://go-api.accessprotocol.co/pools');
  const pools = await res.json();
  console.log("Keys:", Object.keys(pools[0]));
  console.log("First pool:", pools[0]);
}
run();
