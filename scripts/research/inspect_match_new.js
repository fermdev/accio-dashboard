import fetch from 'node-fetch';

async function inspectSupporterObject() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  const poolPk = 'Dap6LDt9uehAsiPrCeAoCXLfNyWwx6ZAKXVkwAnrYtgo'; // Artifex pool (where they have 200k)
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  try {
    const res = await fetch(`https://go-api.accessprotocol.co/supporters/${poolPk}/locked?per_page=1000`, { headers: hubHeaders });
    const data = await res.json();
    const supporters = Array.isArray(data) ? data : (data.supporters || []);
    const match = supporters.find(s => s.pubkey === address || s.address === address);
    
    if (match) {
        console.log('--- MATCH FOUND ---');
        console.log(JSON.stringify(match, null, 2));
    } else {
        console.log('Match not found in Artifex pool.');
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectSupporterObject();
