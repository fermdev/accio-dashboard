export default async function handler(req, res) {
  const { path, wallet, type } = req.query;

  // 1. Handle Staking API Proxy (.../supporters/{wallet}/{type})
  if (path === 'supporters') {
    if (!wallet || !type) return res.status(400).json({ error: 'Wallet and type required' });
    const url = `https://go-api.accessprotocol.co/supporters/${wallet}/${type}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Origin': 'https://hub.accessprotocol.co',
          'Referer': 'https://hub.accessprotocol.co/',
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Staking API failed', details: error.message });
    }
  }

  // 2. Handle DAS/cNFT Proxy (POST requests)
  if (req.method === 'POST') {
    const RPC_ENDPOINTS = [
      'https://wrpc.accessprotocol.co/',
      'https://mainnet.helius-rpc.com/?api-key=accio-fallback' // Dummy key just to try
    ];

    let lastError = null;
    let lastStatus = 0;

    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Origin': 'https://hub.accessprotocol.co',
            'Referer': 'https://hub.accessprotocol.co/'
          },
          body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // If it's an OK response with items (or even empty if it's the official one)
        if (response.ok) {
          return res.status(200).json(data);
        }

        lastStatus = response.status;
        lastError = `RPC ${rpcUrl} returned ${response.status}`;
      } catch (err) {
        lastError = err.message;
      }
    }

    return res.status(lastStatus || 500).json({ error: lastError });
  }

  return res.status(400).json({ error: 'Invalid request' });
}
