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

  // Generate demo transactions
  const demoTransactions = [
    {
      id: 1,
      accountId: 1,
      type: 'expense',
      amount: -45.50,
      description: 'Grocery Store',
      category: 'Food & Dining',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Whole Foods Market'
    },
    {
      id: 2,
      accountId: 1,
      type: 'income',
      amount: 3250.00,
      description: 'Salary Deposit',
      category: 'Income',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Tech Company Inc.'
    },
    {
      id: 3,
      accountId: 1,
      type: 'expense',
      amount: -85.20,
      description: 'Gas Station',
      category: 'Transportation',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Shell'
    },
    {
      id: 4,
      accountId: 2,
      type: 'transfer',
      amount: 500.00,
      description: 'Transfer from Checking',
      category: 'Transfer',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Internal Transfer'
    },
    {
      id: 5,
      accountId: 1,
      type: 'expense',
      amount: -120.75,
      description: 'Electric Bill',
      category: 'Utilities',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Pacific Gas & Electric'
    },
    {
      id: 6,
      accountId: 3,
      type: 'income',
      amount: 450.25,
      description: 'Investment Dividend',
      category: 'Investment',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Vanguard'
    },
    {
      id: 7,
      accountId: 1,
      type: 'expense',
      amount: -25.99,
      description: 'Netflix Subscription',
      category: 'Entertainment',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Netflix'
    },
    {
      id: 8,
      accountId: 4,
      type: 'expense',
      amount: -67.40,
      description: 'Restaurant Dinner',
      category: 'Food & Dining',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      merchant: 'Italian Bistro'
    }
  ];

  try {
    if (req.method === 'GET') {
      // Get transactions with optional filtering
      const { accountId, category, limit = 50 } = req.query;
      
      let filteredTransactions = demoTransactions;
      
      if (accountId) {
        filteredTransactions = filteredTransactions.filter(t => t.accountId == accountId);
      }
      
      if (category) {
        filteredTransactions = filteredTransactions.filter(t => t.category === category);
      }
      
      // Sort by date (most recent first) and limit
      filteredTransactions = filteredTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, parseInt(limit));

      // Calculate summary
      const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      res.json({
        transactions: filteredTransactions,
        summary: {
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          transactionCount: filteredTransactions.length
        }
      });
    }

    if (req.method === 'POST') {
      // Create new transaction
      const { accountId, type, amount, description, category, merchant } = req.body;
      
      const newTransaction = {
        id: Date.now(),
        accountId,
        type,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        description,
        category,
        date: new Date().toISOString(),
        merchant: merchant || 'Manual Entry'
      };

      res.status(201).json({
        message: 'Transaction created successfully',
        transaction: newTransaction
      });
    }

  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({
      error: 'Failed to process transactions request',
      message: error.message
    });
  }
}
