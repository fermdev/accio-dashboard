async function calculateTotalStaked() {
    try {
        const res = await fetch('https://go-api.accessprotocol.co/pools');
        const pools = await res.json();
        
        let total = 0n;
        pools.forEach(p => {
            if (p.TotalStaked) {
                total += BigInt(p.TotalStaked);
            }
        });
        
        console.log("Total Staked (Raw):", total.toString());
        console.log("Total Staked (ACS):", (Number(total) / 1000000).toLocaleString());
        
        // Annual inflation is roughly 5% of total supply.
        // Or fixed amount?
        // Let's assume the user's 28.66% is what we want.
        // If we want to dynamically fetch it, maybe Coingecko is easier?
    } catch (e) {
        console.error(e);
    }
}

calculateTotalStaked();
