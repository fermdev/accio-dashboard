export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use the official Solana RPC as the primary target for standard methods
  const RPC_URL = 'https://api.mainnet-beta.solana.com';

  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    console.error('RPC Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from RPC', 
      details: error.message
    });
  }
}
