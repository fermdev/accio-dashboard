import fetch from 'node-fetch';
import fs from 'fs';

async function findSubscriptionNfts() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  const rpc = 'https://api.mainnet-beta.solana.com';
  
  let allItems = [];
  let page = 1;
  
  console.log('Fetching all assets page by page...');
  
  while (true) {
    const res = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 'get-assets',
        method: 'getAssetsByOwner',
        params: { ownerAddress: address, page, limit: 1000, displayOptions: { showFungible: false } }
      })
    });
    const data = await res.json();
    const items = data.result?.items || [];
    if (items.length === 0) break;
    allItems = allItems.concat(items);
    console.log(`Page ${page}: ${items.length} items (total: ${allItems.length})`);
    if (items.length < 1000) break;
    page++;
  }

  // Find Access Protocol subscription NFTs - they have "Subscription Type" or "Amount" attr indicating ACS stake
  const subscriptionNfts = allItems.filter(item => {
    const attrs = item.content?.metadata?.attributes || [];
    return attrs.some(a => 
      a.trait_type === 'Subscription Type' || 
      a.trait_type === 'Amount' ||
      a.trait_type === 'subscription_type' ||
      a.trait_type === 'Creator Pool Name'
    );
  });

  console.log(`\nFound ${subscriptionNfts.length} subscription NFTs!`);
  
  const results = subscriptionNfts.map(item => ({
    id: item.id,
    name: item.content?.metadata?.name,
    attributes: item.content?.metadata?.attributes
  }));

  fs.writeFileSync('subscription_nfts.json', JSON.stringify(results, null, 2));
  console.log('Saved to subscription_nfts.json');

  // Count by type
  let forever = 0, redeemable = 0, unknown = 0;
  subscriptionNfts.forEach(item => {
    const attrs = item.content?.metadata?.attributes || [];
    const typeAttr = attrs.find(a => a.trait_type === 'Subscription Type');
    if (typeAttr?.value === 'Forever') forever++;
    else if (typeAttr?.value === 'Redeemable') redeemable++;
    else unknown++;
  });

  console.log(`\nForever: ${forever}`);
  console.log(`Redeemable: ${redeemable}`);
  console.log(`Unknown/Other: ${unknown}`);
}

findSubscriptionNfts().catch(console.error);
