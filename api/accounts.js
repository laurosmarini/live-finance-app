export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Demo accounts data
  const demoAccounts = [
    {
      id: 1,
      name: 'Main Checking',
      type: 'checking',
      balance: 5420.50,
      currency: 'USD',
      institution: 'Chase Bank',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Savings Account',
      type: 'savings',
      balance: 12750.25,
      currency: 'USD',
      institution: 'Wells Fargo',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 28940.80,
      currency: 'USD',
      institution: 'Fidelity',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Credit Card',
      type: 'credit',
      balance: -1250.00,
      currency: 'USD',
      institution: 'American Express',
      lastUpdated: new Date().toISOString()
    }
  ];

  try {
    if (req.method === 'GET') {
      // Get all accounts
      const totalBalance = demoAccounts
        .filter(acc => acc.type !== 'credit')
        .reduce((sum, acc) => sum + acc.balance, 0);
      
      const totalDebt = demoAccounts
        .filter(acc => acc.type === 'credit')
        .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

      res.json({
        accounts: demoAccounts,
        summary: {
          totalBalance: totalBalance,
          totalDebt: totalDebt,
          netWorth: totalBalance - totalDebt,
          accountCount: demoAccounts.length
        }
      });
    }

    if (req.method === 'POST') {
      // Create new account
      const { name, type, balance = 0, institution } = req.body;
      
      const newAccount = {
        id: Date.now(),
        name,
        type,
        balance,
        currency: 'USD',
        institution,
        lastUpdated: new Date().toISOString()
      };

      res.status(201).json({
        message: 'Account created successfully',
        account: newAccount
      });
    }

  } catch (error) {
    console.error('Accounts error:', error);
    res.status(500).json({
      error: 'Failed to process accounts request',
      message: error.message
    });
  }
}
