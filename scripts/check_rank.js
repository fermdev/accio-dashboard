async function checkRank(targetPool) {
  try {
    const res = await fetch('https://go-api.accessprotocol.co/pools');
    const pools = await res.json();
    
    // Check if pools is an array
    if (!Array.isArray(pools)) {
        console.log("Not an array", pools);
        return;
    }
    
    console.log("Total pools:", pools.length);
    console.log("Sample pool:", pools[0]);
    
    // Sort by locked amount descending
    // Pool objects might have `LockedTokens` or `supportersCount`.
    pools.sort((a, b) => {
        const lockedA = a.LockedTokens || 0;
        const lockedB = b.LockedTokens || 0;
        return lockedB - lockedA; 
    });
    
    const index = pools.findIndex(p => p.PoolPublicKey === targetPool);
    if (index !== -1) {
        console.log(`Rank for ${targetPool}: #${index + 1} (${pools[index].Name}) - ${pools[index].LockedTokens} locked`);
        
        // Find Rank 1
        console.log("Rank #1:", pools[0].Name, pools[0].LockedTokens);
    } else {
        console.log("Pool not found");
    }
    
  } catch (e) {
    console.error(e);
  }
}

// Access Protocol Pool
checkRank('GesQkZr8R9yVS8rCuMBmfzKJh3kfyFgq6NV9k17aKQnd');
