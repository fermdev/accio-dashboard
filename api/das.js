export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RPC_URL = 'https://wrpc.accessprotocol.co/';

  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({ 
            error: `RPC returned ${response.status}`, 
            body: text 
        });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('DAS Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from DAS RPC', 
      details: error.message,
      stack: error.stack
    });
  }
}
