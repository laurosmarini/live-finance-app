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

  // Demo stock data (simulating live prices)
  const generatePrice = (base, volatility = 0.03) => {
    const change = (Math.random() - 0.5) * 2 * volatility;
    return base * (1 + change);
  };

  const demoStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: generatePrice(185.25),
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: 45000000,
      marketCap: 2890000000000,
      pe: 28.5,
      sector: 'Technology',
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: generatePrice(142.80),
      change: (Math.random() - 0.5) * 8,
      changePercent: (Math.random() - 0.5) * 4,
      volume: 32000000,
      marketCap: 1800000000000,
      pe: 25.2,
      sector: 'Technology',
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: generatePrice(420.15),
      change: (Math.random() - 0.5) * 12,
      changePercent: (Math.random() - 0.5) * 3,
      volume: 28000000,
      marketCap: 3120000000000,
      pe: 32.1,
      sector: 'Technology',
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: generatePrice(152.90),
      change: (Math.random() - 0.5) * 6,
      changePercent: (Math.random() - 0.5) * 4,
      volume: 38000000,
      marketCap: 1580000000000,
      pe: 45.8,
      sector: 'Consumer Discretionary',
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: generatePrice(248.75),
      change: (Math.random() - 0.5) * 15,
      changePercent: (Math.random() - 0.5) * 6,
      volume: 85000000,
      marketCap: 790000000000,
      pe: 65.4,
      sector: 'Consumer Discretionary',
      lastUpdated: new Date().toISOString()
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: generatePrice(875.40),
      change: (Math.random() - 0.5) * 25,
      changePercent: (Math.random() - 0.5) * 8,
      volume: 42000000,
      marketCap: 2150000000000,
      pe: 72.3,
      sector: 'Technology',
      lastUpdated: new Date().toISOString()
    }
  ];

  try {
    if (req.method === 'GET') {
      const { symbol, sector, limit = 10 } = req.query;

      let result = demoStocks;

      // Filter by symbol if provided
      if (symbol) {
        result = result.filter(stock => 
          stock.symbol.toLowerCase() === symbol.toLowerCase()
        );
      }

      // Filter by sector if provided
      if (sector) {
        result = result.filter(stock => 
          stock.sector.toLowerCase() === sector.toLowerCase()
        );
      }

      // Limit results
      result = result.slice(0, parseInt(limit));

      // Add portfolio data for demo user
      const portfolioData = result.map(stock => ({
        ...stock,
        holdings: {
          shares: Math.floor(Math.random() * 50) + 1, // Random shares for demo
          avgCost: stock.price * (0.85 + Math.random() * 0.3),
          totalValue: stock.price * (Math.floor(Math.random() * 50) + 1)
        }
      }));

      // Calculate portfolio summary
      const portfolioValue = portfolioData.reduce((sum, stock) => 
        sum + (stock.holdings?.totalValue || 0), 0
      );

      const portfolioCost = portfolioData.reduce((sum, stock) => 
        sum + (stock.holdings?.avgCost * stock.holdings?.shares || 0), 0
      );

      // Market indices (demo data)
      const marketIndices = [
        {
          name: 'S&P 500',
          symbol: 'SPX',
          value: 4850.25 + (Math.random() - 0.5) * 50,
          change: (Math.random() - 0.5) * 30,
          changePercent: (Math.random() - 0.5) * 2
        },
        {
          name: 'NASDAQ',
          symbol: 'IXIC',
          value: 15420.80 + (Math.random() - 0.5) * 100,
          change: (Math.random() - 0.5) * 80,
          changePercent: (Math.random() - 0.5) * 3
        },
        {
          name: 'Dow Jones',
          symbol: 'DJI',
          value: 38950.15 + (Math.random() - 0.5) * 200,
          change: (Math.random() - 0.5) * 150,
          changePercent: (Math.random() - 0.5) * 1.5
        }
      ];

      res.json({
        stocks: result,
        portfolio: portfolioData,
        indices: marketIndices,
        summary: {
          totalValue: portfolioValue,
          totalCost: portfolioCost,
          totalGainLoss: portfolioValue - portfolioCost,
          gainLossPercentage: portfolioCost > 0 ? ((portfolioValue - portfolioCost) / portfolioCost) * 100 : 0
        },
        lastUpdated: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Stocks error:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      message: error.message
    });
  }
}
