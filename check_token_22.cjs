const { Connection, PublicKey } = require('@solana/web3.js');

const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbmeP97ndH2whTHsAFsqJ4f56XFBNDM91');

async function checkToken22(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Checking Token-22 for: ${userAddress}`);
  
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPk, {
      programId: TOKEN_2022_PROGRAM_ID
    });

    console.log(`Found ${tokenAccounts.value.length} Token-22 accounts`);
    tokenAccounts.value.forEach(a => {
        const info = a.account.data.parsed.info;
        console.log(`- Mint: ${info.mint} | Amount: ${info.tokenAmount.uiAmount}`);
    });

  } catch (e) {
    console.log('Error:', e.message);
  }
}

checkToken22('CvaGTkUGfkViVGMZ3EoLNJiVwdBUrrnRct8GGna8Fqnn');
checkToken22('4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
