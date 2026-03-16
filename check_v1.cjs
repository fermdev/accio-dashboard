const { Connection, PublicKey } = require('@solana/web3.js');

const V1_PROGRAM_ID = new PublicKey('Acs7paNLNjoVf7sTnuWd35TNuR9QQfbajbhXp9X1TTCB');

async function checkV1(userAddress) {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const userPk = new PublicKey(userAddress);

  console.log(`Checking V1 accounts for: ${userAddress}`);
  
  try {
    const accounts = await connection.getProgramAccounts(V1_PROGRAM_ID, {
        filters: [{ memcmp: { offset: 1, bytes: userPk.toBase58() } }]
    });

    console.log(`Found ${accounts.length} V1 accounts`);
    accounts.forEach(({ pubkey }) => {
        console.log(`- V1 Account: ${pubkey.toBase58()}`);
    });

  } catch (e) {
    console.log('Error:', e.message);
  }
}

checkV1('4NUFYm6k84ELFW9nuEe7DqAWmcjrzqQcaxLRcxTRByzP');
