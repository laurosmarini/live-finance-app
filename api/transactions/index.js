export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Demo transactions data
  const generateDemoTransactions = () => {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Travel', 'Income', 'Investment'];
    const merchants = ['Starbucks', 'Uber', 'Amazon', 'Netflix', 'Electric Company', 'CVS Pharmacy', 'Delta Airlines', 'Employer', 'TD Ameritrade'];
    const transactions = [];

    for (let i = 0; i < 20; i++) {
      const isIncome = Math.random() > 0.8;
      const amount = isIncome ? 
        Math.floor(Math.random() * 3000) + 1000 : 
        -(Math.floor(Math.random() * 200) + 10);
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      transactions.push({
        id: (i + 1).toString(),
        accountId: Math.floor(Math.random() * 4) + 1,
        amount: amount,
        description: merchants[Math.floor(Math.random() * merchants.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        date: date.toISOString(),
        type: isIncome ? 'credit' : 'debit',
        pending: Math.random() > 0.9,
        merchant: merchants[Math.floor(Math.random() * merchants.length)]
      });
    }

    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (req.method === 'GET') {
    const { accountId, limit, category } = req.query;
    let transactions = generateDemoTransactions();

    // Filter by account if specified
    if (accountId) {
      transactions = transactions.filter(t => t.accountId.toString() === accountId.toString());
    }

    // Filter by category if specified
    if (category) {
      transactions = transactions.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    }

    // Limit results if specified
    if (limit) {
      transactions = transactions.slice(0, parseInt(limit));
    }

    return res.status(200).json({
      success: true,
      transactions,
      total: transactions.length,
      summary: {
        totalIncome: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0),
        netAmount: transactions.reduce((sum, t) => sum + t.amount, 0)
      }
    });
  }

  if (req.method === 'POST') {
    // Create new transaction
    const { accountId, amount, description, category, merchant } = req.body;
    
    if (!accountId || !amount || !description) {
      return res.status(400).json({ error: 'Account ID, amount, and description are required' });
    }

    const newTransaction = {
      id: Date.now().toString(),
      accountId,
      amount: parseFloat(amount),
      description,
      category: category || 'Other',
      date: new Date().toISOString(),
      type: amount > 0 ? 'credit' : 'debit',
      pending: false,
      merchant: merchant || description
    };

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      transaction: newTransaction
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
