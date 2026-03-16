export default async function handler(req, res) {
  // 1. Handle Metadata Proxy (GET requests with ?url=...)
  if (req.method === 'GET') {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL required' });
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch metadata', details: error.message });
    }
  }

  // 2. Handle RPC Proxy (POST requests)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RPC_ENDPOINTS = [
    'https://wrpc.accessprotocol.co/',           // Official
    'https://accessprotocol.rpcpool.com/',       // Triton Fallback
    'https://mainnet.helius-rpc.com/?api-key=accio-dummy', // Helius Fallback
    'https://solana.publicnode.com'               // Generic Fallback
  ];

  let lastError = null;
  let lastStatus = 500;

  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      console.log(`[Proxy] Attempting sync via ${rpcUrl}`);
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'https://hub.accessprotocol.co',
          'Referer': 'https://hub.accessprotocol.co/'
        },
        body: JSON.stringify(req.body)
      });

      lastStatus = response.status;
      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      }
      
      const errText = await response.text();
      lastError = `RPC ${rpcUrl} returned ${response.status}: ${errText.slice(0, 50)}`;
      console.warn(`[Proxy] ${rpcUrl} failed: ${lastError}`);
    } catch (error) {
      lastError = error.message;
      console.warn(`[Proxy] ${rpcUrl} fetch error: ${error.message}`);
    }
  }

  res.status(lastStatus).json({ 
    error: lastError || 'All RPC endpoints failed', 
    details: 'Sync failed due to network restrictions. We tried multiple providers.' 
  });
}
