export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Demo financial accounts data
  const demoAccounts = [
    {
      id: '1',
      name: 'Checking Account',
      type: 'checking',
      balance: 2548.75,
      currency: 'USD',
      accountNumber: '****1234',
      bank: 'Demo Bank',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Savings Account',
      type: 'savings',
      balance: 12750.50,
      currency: 'USD',
      accountNumber: '****5678',
      bank: 'Demo Bank',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 45320.25,
      currency: 'USD',
      accountNumber: '****9012',
      bank: 'Demo Investment',
      lastUpdated: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Credit Card',
      type: 'credit',
      balance: -1245.80,
      currency: 'USD',
      accountNumber: '****3456',
      bank: 'Demo Credit Union',
      lastUpdated: new Date().toISOString()
    }
  ];

  if (req.method === 'GET') {
    // Return user's accounts
    return res.status(200).json({
      success: true,
      accounts: demoAccounts,
      totalBalance: demoAccounts.reduce((sum, acc) => sum + acc.balance, 0)
    });
  }

  if (req.method === 'POST') {
    // Create new account
    const { name, type, balance = 0, bank, accountNumber } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const newAccount = {
      id: (demoAccounts.length + 1).toString(),
      name,
      type,
      balance: parseFloat(balance) || 0,
      currency: 'USD',
      accountNumber: accountNumber || '****0000',
      bank: bank || 'Demo Bank',
      lastUpdated: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      account: newAccount
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
