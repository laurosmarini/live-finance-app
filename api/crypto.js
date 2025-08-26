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

  // Demo crypto data (simulating live prices)
  const generatePrice = (base, volatility = 0.05) => {
    const change = (Math.random() - 0.5) * 2 * volatility;
    return base * (1 + change);
  };

  const demoCryptos = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      price: generatePrice(43250.80),
      change24h: (Math.random() - 0.5) * 10,
      marketCap: 845000000000,
      volume24h: 28500000000,
      rank: 1,
      image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      price: generatePrice(2580.45),
      change24h: (Math.random() - 0.5) * 8,
      marketCap: 310000000000,
      volume24h: 15200000000,
      rank: 2,
      image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      price: generatePrice(98.75),
      change24h: (Math.random() - 0.5) * 12,
      marketCap: 45000000000,
      volume24h: 2800000000,
      rank: 5,
      image: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      price: generatePrice(0.48),
      change24h: (Math.random() - 0.5) * 15,
      marketCap: 17000000000,
      volume24h: 850000000,
      rank: 8,
      image: 'https://assets.coingecko.com/coins/images/975/thumb/cardano.png',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'polygon',
      symbol: 'MATIC',
      name: 'Polygon',
      price: generatePrice(0.82),
      change24h: (Math.random() - 0.5) * 18,
      marketCap: 8200000000,
      volume24h: 420000000,
      rank: 12,
      image: 'https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png',
      lastUpdated: new Date().toISOString()
    }
  ];

  try {
    if (req.method === 'GET') {
      const { symbol, limit = 10 } = req.query;

      let result = demoCryptos;

      // Filter by symbol if provided
      if (symbol) {
        result = result.filter(crypto => 
          crypto.symbol.toLowerCase() === symbol.toLowerCase()
        );
      }

      // Limit results
      result = result.slice(0, parseInt(limit));

      // Add portfolio data for demo user
      const portfolioData = result.map(crypto => ({
        ...crypto,
        holdings: {
          amount: Math.random() * 2, // Random holdings for demo
          value: crypto.price * Math.random() * 2,
          avgBuyPrice: crypto.price * (0.8 + Math.random() * 0.4)
        }
      }));

      // Calculate portfolio summary
      const portfolioValue = portfolioData.reduce((sum, crypto) => 
        sum + (crypto.holdings?.value || 0), 0
      );

      const portfolioCost = portfolioData.reduce((sum, crypto) => 
        sum + (crypto.holdings?.avgBuyPrice * crypto.holdings?.amount || 0), 0
      );

      res.json({
        cryptos: result,
        portfolio: portfolioData,
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
    console.error('Crypto error:', error);
    res.status(500).json({
      error: 'Failed to fetch crypto data',
      message: error.message
    });
  }
}
