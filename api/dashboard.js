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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Comprehensive dashboard data
    const dashboardData = {
      user: {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@finance-app.com'
      },
      
      financialSummary: {
        totalNetWorth: 45861.55,
        totalAssets: 47111.55,
        totalDebts: 1250.00,
        monthlyIncome: 3250.00,
        monthlyExpenses: 2845.75,
        savingsRate: 12.4,
        emergencyFund: 12750.25,
        lastUpdated: new Date().toISOString()
      },

      accounts: [
        {
          id: 1,
          name: 'Main Checking',
          type: 'checking',
          balance: 5420.50,
          institution: 'Chase Bank',
          trend: 'up'
        },
        {
          id: 2,
          name: 'Savings Account',
          type: 'savings',
          balance: 12750.25,
          institution: 'Wells Fargo',
          trend: 'up'
        },
        {
          id: 3,
          name: 'Investment Portfolio',
          type: 'investment',
          balance: 28940.80,
          institution: 'Fidelity',
          trend: 'up'
        },
        {
          id: 4,
          name: 'Credit Card',
          type: 'credit',
          balance: -1250.00,
          institution: 'American Express',
          trend: 'down'
        }
      ],

      recentTransactions: [
        {
          id: 1,
          description: 'Salary Deposit',
          amount: 3250.00,
          category: 'Income',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'income'
        },
        {
          id: 2,
          description: 'Grocery Store',
          amount: -45.50,
          category: 'Food & Dining',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'expense'
        },
        {
          id: 3,
          description: 'Gas Station',
          amount: -85.20,
          category: 'Transportation',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'expense'
        },
        {
          id: 4,
          description: 'Investment Dividend',
          amount: 450.25,
          category: 'Investment',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'income'
        }
      ],

      portfolio: {
        stocks: {
          totalValue: 18750.40,
          dayChange: 245.80,
          dayChangePercent: 1.33,
          holdings: [
            { symbol: 'AAPL', shares: 50, value: 9262.50, change: 1.2 },
            { symbol: 'GOOGL', shares: 30, value: 4284.00, change: -0.8 },
            { symbol: 'MSFT', shares: 12, value: 5203.90, change: 2.1 }
          ]
        },
        crypto: {
          totalValue: 8420.15,
          dayChange: -125.40,
          dayChangePercent: -1.47,
          holdings: [
            { symbol: 'BTC', amount: 0.15, value: 6487.62, change: -2.1 },
            { symbol: 'ETH', amount: 0.75, value: 1932.53, change: -0.9 }
          ]
        }
      },

      budgets: [
        {
          id: 1,
          category: 'Food & Dining',
          budgeted: 600.00,
          spent: 245.50,
          remaining: 354.50,
          percentUsed: 40.9
        },
        {
          id: 2,
          category: 'Transportation',
          budgeted: 300.00,
          spent: 185.20,
          remaining: 114.80,
          percentUsed: 61.7
        },
        {
          id: 3,
          category: 'Entertainment',
          budgeted: 200.00,
          spent: 125.99,
          remaining: 74.01,
          percentUsed: 63.0
        },
        {
          id: 4,
          category: 'Utilities',
          budgeted: 250.00,
          spent: 220.75,
          remaining: 29.25,
          percentUsed: 88.3
        }
      ],

      monthlyTrends: {
        income: [3200, 3250, 3180, 3250, 3300, 3250],
        expenses: [2800, 2845, 2920, 2780, 2850, 2845],
        savings: [400, 405, 260, 470, 450, 405],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },

      goals: [
        {
          id: 1,
          name: 'Emergency Fund',
          target: 15000,
          current: 12750.25,
          progress: 85,
          dueDate: '2024-12-31'
        },
        {
          id: 2,
          name: 'Vacation Fund',
          target: 5000,
          current: 2400,
          progress: 48,
          dueDate: '2024-08-15'
        },
        {
          id: 3,
          name: 'Investment Portfolio',
          target: 50000,
          current: 28940.80,
          progress: 58,
          dueDate: '2025-12-31'
        }
      ],

      insights: [
        {
          type: 'positive',
          message: 'Your savings rate increased by 2.1% this month!',
          category: 'savings'
        },
        {
          type: 'warning',
          message: 'You\'re 88% through your utilities budget for this month.',
          category: 'budget'
        },
        {
          type: 'info',
          message: 'Your investment portfolio gained $245.80 today.',
          category: 'investment'
        }
      ],

      lastUpdated: new Date().toISOString()
    };

    res.json(dashboardData);

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
}
