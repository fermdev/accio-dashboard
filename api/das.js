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

  // Use the official Access Protocol RPC as the primary target for reliability
  const RPC_URL = 'https://wrpc.accessprotocol.co/';

  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({ 
            error: `RPC returned ${response.status}`, 
            body: text.slice(0, 1000) 
        });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('DAS Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from RPC', 
      details: error.message 
    });
  }
}
