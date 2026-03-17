const fetch = require('node-fetch');
const fs = require('fs');

async function debugCnfts() {
  const URL = 'https://api.mainnet-beta.solana.com';
  const rpcBody = {
    jsonrpc: '2.0',
    id: 'test',
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: 'HLSxLAsaJWqttv1ZQaBzC3ZEjSbJva2qzc6JbREJpkn6',
      page: 1,
      limit: 100
    }
  };

  try {
    let out = '';
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcBody)
    });
    
    if (res.ok) {
        const data = await res.json();
        const items = data.result?.items || [];
        out += `Found ${items.length} assets.\n`;
        
        const accessItems = items.filter(i => {
            const name = i.content?.metadata?.name || '';
            const symbol = i.content?.metadata?.symbol || '';
            const attrs = i.content?.metadata?.attributes || i.metadata?.attributes || i.attributes || [];
            return name.includes('Access') || symbol === 'ACS' || attrs.some(a => String(a.value).includes('Access Protocol'));
        });

        out += `Filtered down to ${accessItems.length} Access assets.\n`;
        
        for (let i = 0; i < accessItems.length; i++) {
            const item = accessItems[i];
            out += `\n--- Item ${i+1} ---\n`;
            out += `Name: ${item.content?.metadata?.name}\n`;
            out += `Symbol: ${item.content?.metadata?.symbol}\n`;
            
            const attrs = item.content?.metadata?.attributes || item.metadata?.attributes || item.attributes || [];
            out += 'Attributes:\n';
            attrs.forEach(a => {
                out += `  [${a.trait_type}]: ${a.value}\n`;
            });
        }
    }
    fs.writeFileSync('debug_cnfts_out.txt', out, 'utf-8');
    console.log('Done!');
  } catch (err) {
    console.log('Exception:', err.message);
  }
}

debugCnfts();
