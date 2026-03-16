const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testOfficialV2(userAddress) {
  const url = `https://go-api.accessprotocol.co/v2/subscribers/${userAddress}/subscriptions`;
  console.log(`--- Testing Official V2 for User: ${userAddress} ---`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Accept': 'application/json'
      }
    });
    
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log('Data:', JSON.stringify(data, null, 2));
      
      const subs = data.subscriptions || data || [];
      let forever = 0;
      let redeemable = 0;
      
      // Look for forever/redeemable flags in the sub objects
      subs.forEach(sub => {
          if (sub.is_forever || sub.type === 'forever') forever++;
          if (sub.is_redeemable || sub.type === 'redeemable') redeemable++;
      });
      console.log(`Counted: Forever=${forever}, Redeemable=${redeemable}`);
    }
  } catch (e) {
    console.log('Fetch Error:', e.message);
  }
}

testOfficialV2('HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6');
// Also test the AlphaCoded pool address just in case I misunderstood the URL
testOfficialV2('4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
