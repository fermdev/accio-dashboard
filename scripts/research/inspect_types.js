import fetch from 'node-fetch';

async function inspectSupporterTypes() {
  const address = 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6';
  const hubHeaders = {
    'Origin': 'https://hub.accessprotocol.co',
    'Referer': 'https://hub.accessprotocol.co/',
    'Accept': 'application/json'
  };

  // We'll check the "locked" endpoint first and see if there's a type
  const testPool = '7fFpwn5nMnqurS8Y38lHl3l3p2rA4uBv9V9v9vV9v9v9'; // Example pool
  
  try {
    console.log('Checking "locked" supporters...');
    const res = await fetch(`https://go-api.accessprotocol.co/supporters/6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup/locked?per_page=10`, { headers: hubHeaders });
    const data = await res.json();
    console.log('Sample Supporter:', JSON.stringify(data[0] || data.supporters?.[0], null, 2));

    console.log('\nChecking for a "bonded" endpoint...');
    const res2 = await fetch(`https://go-api.accessprotocol.co/supporters/6HW8dXjtiTGkD4jzXs7igdFmZExPpmwUrRN5195xGup/bonded`, { headers: hubHeaders });
    console.log('Bonded status:', res2.status);
    if (res2.ok) {
        const data2 = await res2.json();
        console.log('Bonded sample:', JSON.stringify(data2[0] || data2.supporters?.[0], null, 2));
    }
  } catch (err) {
    console.log('Error:', err.message);
  }
}

inspectSupporterTypes();
