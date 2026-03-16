export default async function handler(req, res) {
  // Use query parameters for maximum compatibility: /api/supporters?wallet=WALLET&type=TYPE
  const { wallet, type } = req.query;

  if (!wallet || !type) {
    return res.status(400).json({ 
      error: 'Wallet and Type required as query parameters.',
      received: req.query
    });
  }

  const url = `https://go-api.accessprotocol.co/supporters/${wallet}/${type}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Origin': 'https://hub.accessprotocol.co',
        'Referer': 'https://hub.accessprotocol.co/',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Hub API returned ${response.status}`, details: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to proxy staking data', details: error.message });
  }
}
