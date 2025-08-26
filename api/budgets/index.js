export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Demo budgets data
  const demoBudgets = [
    {
      id: '1',
      category: 'Food & Dining',
      budgetAmount: 800,
      spentAmount: 645.50,
      period: 'monthly',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      status: 'on-track'
    },
    {
      id: '2',
      category: 'Transportation',
      budgetAmount: 400,
      spentAmount: 420.75,
      period: 'monthly',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      status: 'over-budget'
    },
    {
      id: '3',
      category: 'Entertainment',
      budgetAmount: 300,
      spentAmount: 125.25,
      period: 'monthly',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      status: 'under-budget'
    },
    {
      id: '4',
      category: 'Shopping',
      budgetAmount: 500,
      spentAmount: 380.90,
      period: 'monthly',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      status: 'on-track'
    },
    {
      id: '5',
      category: 'Bills & Utilities',
      budgetAmount: 1200,
      spentAmount: 1150.00,
      period: 'monthly',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      status: 'on-track'
    }
  ];

  if (req.method === 'GET') {
    // Calculate budget statistics
    const totalBudget = demoBudgets.reduce((sum, budget) => sum + budget.budgetAmount, 0);
    const totalSpent = demoBudgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
    const remainingBudget = totalBudget - totalSpent;
    
    const budgetAnalysis = {
      totalBudget,
      totalSpent,
      remainingBudget,
      utilizationPercentage: (totalSpent / totalBudget * 100).toFixed(1),
      budgetsOverLimit: demoBudgets.filter(b => b.status === 'over-budget').length,
      budgetsOnTrack: demoBudgets.filter(b => b.status === 'on-track').length,
      budgetsUnderBudget: demoBudgets.filter(b => b.status === 'under-budget').length
    };

    return res.status(200).json({
      success: true,
      budgets: demoBudgets,
      analysis: budgetAnalysis
    });
  }

  if (req.method === 'POST') {
    // Create new budget
    const { category, budgetAmount, period = 'monthly' } = req.body;
    
    if (!category || !budgetAmount) {
      return res.status(400).json({ error: 'Category and budget amount are required' });
    }

    const newBudget = {
      id: (demoBudgets.length + 1).toString(),
      category,
      budgetAmount: parseFloat(budgetAmount),
      spentAmount: 0,
      period,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      status: 'on-track'
    };

    return res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget: newBudget
    });
  }

  if (req.method === 'PUT') {
    // Update budget
    const { id, budgetAmount, category } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Budget ID is required' });
    }

    const budgetIndex = demoBudgets.findIndex(b => b.id === id);
    if (budgetIndex === -1) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const updatedBudget = {
      ...demoBudgets[budgetIndex],
      ...(budgetAmount && { budgetAmount: parseFloat(budgetAmount) }),
      ...(category && { category })
    };

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget: updatedBudget
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
