export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Demo portfolio data
  const demoPortfolio = {
    totalValue: 45320.25,
    totalGainLoss: 8520.45,
    totalGainLossPercent: 23.15,
    lastUpdated: new Date().toISOString(),
    holdings: [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        shares: 25,
        averagePrice: 180.50,
        currentPrice: 192.50,
        totalValue: 4812.50,
        gainLoss: 300.00,
        gainLossPercent: 6.66,
        purchaseDate: '2023-08-15T00:00:00.000Z'
      },
      {
        id: '2',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        type: 'stock',
        shares: 15,
        averagePrice: 395.00,
        currentPrice: 415.75,
        totalValue: 6236.25,
        gainLoss: 311.25,
        gainLossPercent: 5.25,
        purchaseDate: '2023-07-20T00:00:00.000Z'
      },
      {
        id: '3',
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        shares: 0.15,
        averagePrice: 38500.00,
        currentPrice: 43250.00,
        totalValue: 6487.50,
        gainLoss: 712.50,
        gainLossPercent: 12.34,
        purchaseDate: '2023-06-10T00:00:00.000Z'
      },
      {
        id: '4',
        symbol: 'ETH',
        name: 'Ethereum',
        type: 'crypto',
        shares: 5.2,
        averagePrice: 2200.00,
        currentPrice: 2580.00,
        totalValue: 13416.00,
        gainLoss: 1976.00,
        gainLossPercent: 17.28,
        purchaseDate: '2023-05-25T00:00:00.000Z'
      },
      {
        id: '5',
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        type: 'etf',
        shares: 20,
        averagePrice: 455.00,
        currentPrice: 475.80,
        totalValue: 9516.00,
        gainLoss: 416.00,
        gainLossPercent: 4.57,
        purchaseDate: '2023-09-01T00:00:00.000Z'
      },
      {
        id: '6',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'stock',
        shares: 10,
        averagePrice: 135.00,
        currentPrice: 140.25,
        totalValue: 1402.50,
        gainLoss: 52.50,
        gainLossPercent: 3.89,
        purchaseDate: '2023-10-12T00:00:00.000Z'
      }
    ]
  };

  if (req.method === 'GET') {
    // Calculate portfolio analytics
    const analytics = {
      assetAllocation: {
        stocks: demoPortfolio.holdings.filter(h => h.type === 'stock').reduce((sum, h) => sum + h.totalValue, 0),
        crypto: demoPortfolio.holdings.filter(h => h.type === 'crypto').reduce((sum, h) => sum + h.totalValue, 0),
        etf: demoPortfolio.holdings.filter(h => h.type === 'etf').reduce((sum, h) => sum + h.totalValue, 0)
      },
      topPerformers: demoPortfolio.holdings
        .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
        .slice(0, 3),
      diversification: {
        totalAssets: demoPortfolio.holdings.length,
        assetTypes: [...new Set(demoPortfolio.holdings.map(h => h.type))].length
      },
      riskMetrics: {
        volatility: 15.2, // Simulated volatility percentage
        sharpeRatio: 1.35,
        beta: 1.12
      }
    };

    return res.status(200).json({
      success: true,
      portfolio: demoPortfolio,
      analytics
    });
  }

  if (req.method === 'POST') {
    // Add new holding to portfolio
    const { symbol, name, type, shares, purchasePrice } = req.body;
    
    if (!symbol || !shares || !purchasePrice || !type) {
      return res.status(400).json({ error: 'Symbol, shares, purchase price, and type are required' });
    }

    // Simulate current price (in real app, fetch from market data)
    const currentPrice = purchasePrice * (1 + (Math.random() - 0.5) * 0.1);
    const totalValue = shares * currentPrice;
    const gainLoss = (currentPrice - purchasePrice) * shares;
    const gainLossPercent = (gainLoss / (purchasePrice * shares)) * 100;

    const newHolding = {
      id: (demoPortfolio.holdings.length + 1).toString(),
      symbol: symbol.toUpperCase(),
      name: name || symbol,
      type,
      shares: parseFloat(shares),
      averagePrice: parseFloat(purchasePrice),
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      totalValue: parseFloat(totalValue.toFixed(2)),
      gainLoss: parseFloat(gainLoss.toFixed(2)),
      gainLossPercent: parseFloat(gainLossPercent.toFixed(2)),
      purchaseDate: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: 'Holding added to portfolio successfully',
      holding: newHolding
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
