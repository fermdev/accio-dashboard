const { PublicKey } = require('@solana/web3.js');

try {
  const addr = '3VmEjP2gjMKgzQosB59AEC6wwNCT9AsYEDhogBdwqSrC';
  const pk = new PublicKey(addr);
  console.log('Valid:', pk.toBase58());
} catch (e) {
  console.log('Invalid:', e.message);
}
