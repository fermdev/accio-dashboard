const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testOfficialApi(userAddress) {
  const url = `https://api.accessprotocol.co/v2/subscribers/${userAddress}/subscriptions`;
  console.log(`--- Testing Official API: ${url} ---`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'Accept': 'application/json'
      }
    });

    console.log(`Status: ${res.status}`);
    if (!res.ok) {
        console.log('Failed to fetch from official API');
        return;
    }

    const data = await res.json();
    console.log('Success! Data structure:');
    console.log(JSON.stringify(data, null, 2));

    // Analyze counts
    const subscriptions = data.subscriptions || data || [];
    let forever = 0;
    let redeemable = 0;

    if (Array.isArray(subscriptions)) {
        subscriptions.forEach(sub => {
            const type = (sub.subscription_type || sub.type || "").toLowerCase();
            if (type.includes('forever')) forever++;
            else if (type.includes('redeemable')) redeemable++;
        });
    }

    console.log(`\nDetected Forever: ${forever}`);
    console.log(`Detected Redeemable: ${redeemable}`);

  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

const target = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
testOfficialApi(target);
