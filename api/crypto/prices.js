export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Demo crypto data with realistic price movements
  const generateCryptoPrice = (basePrice, volatility = 0.05) => {
    const changePercent = (Math.random() - 0.5) * volatility * 2;
    const newPrice = basePrice * (1 + changePercent);
    return {
      current: parseFloat(newPrice.toFixed(2)),
      change24h: parseFloat((changePercent * 100).toFixed(2))
    };
  };

  const cryptoData = {
    bitcoin: {
      symbol: 'BTC',
      name: 'Bitcoin',
      ...generateCryptoPrice(43250, 0.08),
      marketCap: 847250000000,
      volume24h: 22500000000,
      circulatingSupply: 19584375
    },
    ethereum: {
      symbol: 'ETH',
      name: 'Ethereum',
      ...generateCryptoPrice(2580, 0.10),
      marketCap: 310200000000,
      volume24h: 15800000000,
      circulatingSupply: 120280000
    },
    binancecoin: {
      symbol: 'BNB',
      name: 'BNB',
      ...generateCryptoPrice(315, 0.12),
      marketCap: 47250000000,
      volume24h: 1200000000,
      circulatingSupply: 150000000
    },
    solana: {
      symbol: 'SOL',
      name: 'Solana',
      ...generateCryptoPrice(98.5, 0.15),
      marketCap: 42800000000,
      volume24h: 2100000000,
      circulatingSupply: 434500000
    },
    cardano: {
      symbol: 'ADA',
      name: 'Cardano',
      ...generateCryptoPrice(0.485, 0.13),
      marketCap: 17200000000,
      volume24h: 380000000,
      circulatingSupply: 35450000000
    },
    polkadot: {
      symbol: 'DOT',
      name: 'Polkadot',
      ...generateCryptoPrice(7.25, 0.14),
      marketCap: 9800000000,
      volume24h: 185000000,
      circulatingSupply: 1352000000
    },
    avalanche: {
      symbol: 'AVAX',
      name: 'Avalanche',
      ...generateCryptoPrice(38.75, 0.16),
      marketCap: 14200000000,
      volume24h: 475000000,
      circulatingSupply: 366500000
    },
    chainlink: {
      symbol: 'LINK',
      name: 'Chainlink',
      ...generateCryptoPrice(14.85, 0.12),
      marketCap: 8450000000,
      volume24h: 285000000,
      circulatingSupply: 569000000
    }
  };

  const { symbols } = req.query;
  
  if (symbols) {
    // Filter specific cryptocurrencies
    const requestedSymbols = symbols.split(',').map(s => s.toLowerCase());
    const filteredData = {};
    
    requestedSymbols.forEach(symbol => {
      const crypto = Object.entries(cryptoData).find(([key, data]) => 
        data.symbol.toLowerCase() === symbol || key === symbol
      );
      if (crypto) {
        filteredData[crypto[0]] = crypto[1];
      }
    });
    
    return res.status(200).json({
      success: true,
      data: filteredData,
      timestamp: new Date().toISOString()
    });
  }

  // Return all crypto data
  return res.status(200).json({
    success: true,
    data: cryptoData,
    timestamp: new Date().toISOString(),
    marketSummary: {
      totalMarketCap: Object.values(cryptoData).reduce((sum, crypto) => sum + crypto.marketCap, 0),
      total24hVolume: Object.values(cryptoData).reduce((sum, crypto) => sum + crypto.volume24h, 0),
      totalCoins: Object.keys(cryptoData).length
    }
  });
}
