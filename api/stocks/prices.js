export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Demo stock data with realistic price movements
  const generateStockPrice = (basePrice, volatility = 0.03) => {
    const changePercent = (Math.random() - 0.5) * volatility * 2;
    const newPrice = basePrice * (1 + changePercent);
    const change = newPrice - basePrice;
    return {
      current: parseFloat(newPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat((changePercent * 100).toFixed(2)),
      open: parseFloat((basePrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
      high: parseFloat((newPrice * (1 + Math.random() * 0.02)).toFixed(2)),
      low: parseFloat((newPrice * (1 - Math.random() * 0.02)).toFixed(2))
    };
  };

  const stockData = {
    AAPL: {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      ...generateStockPrice(192.50, 0.04),
      volume: 52840000,
      marketCap: 2985000000000,
      peRatio: 31.2,
      dividendYield: 0.43
    },
    MSFT: {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      ...generateStockPrice(415.75, 0.03),
      volume: 28650000,
      marketCap: 3090000000000,
      peRatio: 35.8,
      dividendYield: 0.68
    },
    GOOGL: {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      ...generateStockPrice(140.25, 0.04),
      volume: 31200000,
      marketCap: 1750000000000,
      peRatio: 26.4,
      dividendYield: 0.0
    },
    AMZN: {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      sector: 'Consumer Discretionary',
      ...generateStockPrice(151.80, 0.05),
      volume: 45800000,
      marketCap: 1580000000000,
      peRatio: 48.2,
      dividendYield: 0.0
    },
    TSLA: {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      sector: 'Consumer Discretionary',
      ...generateStockPrice(248.50, 0.08),
      volume: 78900000,
      marketCap: 790000000000,
      peRatio: 62.1,
      dividendYield: 0.0
    },
    NVDA: {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      sector: 'Technology',
      ...generateStockPrice(485.20, 0.06),
      volume: 42100000,
      marketCap: 1190000000000,
      peRatio: 73.5,
      dividendYield: 0.03
    },
    META: {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      sector: 'Technology',
      ...generateStockPrice(342.75, 0.05),
      volume: 19800000,
      marketCap: 870000000000,
      peRatio: 24.8,
      dividendYield: 0.35
    },
    JPM: {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      sector: 'Financial Services',
      ...generateStockPrice(168.90, 0.03),
      volume: 12400000,
      marketCap: 485000000000,
      peRatio: 12.5,
      dividendYield: 2.85
    },
    JNJ: {
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      sector: 'Healthcare',
      ...generateStockPrice(162.45, 0.02),
      volume: 8600000,
      marketCap: 425000000000,
      peRatio: 15.8,
      dividendYield: 2.94
    },
    V: {
      symbol: 'V',
      name: 'Visa Inc.',
      sector: 'Financial Services',
      ...generateStockPrice(258.30, 0.03),
      volume: 6800000,
      marketCap: 545000000000,
      peRatio: 32.1,
      dividendYield: 0.74
    }
  };

  const { symbols, sector } = req.query;
  
  if (symbols) {
    // Filter specific stocks
    const requestedSymbols = symbols.split(',').map(s => s.toUpperCase());
    const filteredData = {};
    
    requestedSymbols.forEach(symbol => {
      if (stockData[symbol]) {
        filteredData[symbol] = stockData[symbol];
      }
    });
    
    return res.status(200).json({
      success: true,
      data: filteredData,
      timestamp: new Date().toISOString()
    });
  }

  if (sector) {
    // Filter by sector
    const filteredData = {};
    Object.entries(stockData).forEach(([symbol, data]) => {
      if (data.sector.toLowerCase().includes(sector.toLowerCase())) {
        filteredData[symbol] = data;
      }
    });
    
    return res.status(200).json({
      success: true,
      data: filteredData,
      timestamp: new Date().toISOString()
    });
  }

  // Return all stock data
  const marketIndices = {
    SPY: {
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF',
      ...generateStockPrice(475.80, 0.02),
      volume: 85600000
    },
    QQQ: {
      symbol: 'QQQ',
      name: 'Invesco QQQ ETF',
      ...generateStockPrice(398.50, 0.03),
      volume: 43200000
    },
    DIA: {
      symbol: 'DIA',
      name: 'SPDR Dow Jones ETF',
      ...generateStockPrice(345.20, 0.02),
      volume: 4800000
    }
  };

  return res.status(200).json({
    success: true,
    data: stockData,
    indices: marketIndices,
    timestamp: new Date().toISOString(),
    marketSummary: {
      totalStocks: Object.keys(stockData).length,
      sectors: [...new Set(Object.values(stockData).map(stock => stock.sector))],
      avgPeRatio: (Object.values(stockData).reduce((sum, stock) => sum + stock.peRatio, 0) / Object.keys(stockData).length).toFixed(2)
    }
  });
}
