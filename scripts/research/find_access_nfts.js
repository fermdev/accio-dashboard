import fetch from 'node-fetch';
import fs from 'fs';

async function findAccessNfts() {
  const address = '9tcpMyohDDQ4yHj67NurmAranKV7squ72f2o587gaqsk';
  
  // mainnet-beta.solana.com supports DAS API
  const rpc = 'https://api.mainnet-beta.solana.com';
  
  console.log('Fetching all assets by owner...');
  const res = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'get-assets',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: address,
        page: 1,
        limit: 1000,
        displayOptions: { showFungible: false }
      }
    })
  });

  const data = await res.json();
  const items = data.result?.items || [];
  console.log(`Total assets: ${items.length}`);

  // Look for Access Protocol subscription NFTs
  const accessNfts = items.filter(item => {
    const name = item.content?.metadata?.name || '';
    const symbol = item.content?.metadata?.symbol || '';
    const collection = item.grouping?.find(g => g.group_key === 'collection')?.group_value || '';
    return name.includes('Access') || symbol === 'ACS' || name.includes('Subscription') || collection.includes('ACS');
  });
  
  console.log(`Access Protocol NFTs found: ${accessNfts.length}`);
  
  // Also look for ones with "Subscription Type" attribute
  const withSubType = items.filter(item => {
    const attrs = item.content?.metadata?.attributes || [];
    return attrs.some(a => a.trait_type === 'Subscription Type' || a.trait_type === 'subscription_type');
  });
  console.log(`NFTs with Subscription Type attribute: ${withSubType.length}`);

  // Save all items to file for inspection
  fs.writeFileSync('all_nfts.json', JSON.stringify(items.slice(0, 5), null, 2));
  console.log('Saved first 5 NFTs to all_nfts.json');

  if (withSubType.length > 0) {
    console.log('SUBSCRIPTION TYPE FOUND:');
    withSubType.forEach(item => {
      const attrs = item.content?.metadata?.attributes || [];
      console.log('Name:', item.content?.metadata?.name);
      console.log('Attributes:', JSON.stringify(attrs, null, 2));
    });
  }
}

findAccessNfts().catch(console.error);
