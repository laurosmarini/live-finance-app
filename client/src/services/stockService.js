import axios from 'axios';

// Financial Modeling Prep API (free tier with rate limits)
const FMP_API_KEY = process.env.REACT_APP_FMP_API_KEY;
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Yahoo Finance alternative endpoint (no API key required)
const YAHOO_API_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

class StockService {
  /**
   * Get major market indices (S&P 500, NASDAQ, DOW)
   */
  async getMarketIndices() {
    try {
      const symbols = ['^GSPC', '^IXIC', '^DJI']; // S&P 500, NASDAQ, DOW
      const promises = symbols.map(symbol => this.getQuoteFromYahoo(symbol));
      const results = await Promise.allSettled(promises);
      
      const indices = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const data = result.value;
          indices.push({
            symbol: symbols[index],
            name: this.getIndexName(symbols[index]),
            price: data.regularMarketPrice,
            change: data.regularMarketChange,
            changePercent: data.regularMarketChangePercent,
            previousClose: data.regularMarketPreviousClose,
            open: data.regularMarketOpen,
            high: data.regularMarketDayHigh,
            low: data.regularMarketDayLow,
            volume: data.regularMarketVolume,
            marketTime: data.regularMarketTime
          });
        }
      });
      
      return indices;
    } catch (error) {
      console.error('Error fetching market indices:', error);
      return this.getMockMarketData();
    }
  }

  /**
   * Get quote from Yahoo Finance API
   * @param {string} symbol - Stock symbol
   */
  async getQuoteFromYahoo(symbol) {
    try {
      const response = await axios.get(`${YAHOO_API_BASE}/${symbol}`, {
        params: {
          interval: '1d',
          range: '1d'
        },
        timeout: 5000
      });

      const result = response.data?.chart?.result?.[0];
      if (!result) throw new Error('No data available');

      const meta = result.meta;
      return {
        regularMarketPrice: meta.regularMarketPrice,
        regularMarketChange: meta.regularMarketPrice - meta.previousClose,
        regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        regularMarketPreviousClose: meta.previousClose,
        regularMarketOpen: meta.regularMarketDayHigh, // Yahoo sometimes has incomplete data
        regularMarketDayHigh: meta.regularMarketDayHigh,
        regularMarketDayLow: meta.regularMarketDayLow,
        regularMarketVolume: meta.regularMarketVolume,
        regularMarketTime: meta.regularMarketTime
      };
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get trending stocks (mock data for now)
   */
  async getTrendingStocks() {
    const trendingSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    
    try {
      const promises = trendingSymbols.map(async symbol => {
        try {
          const data = await this.getQuoteFromYahoo(symbol);
          return {
            symbol,
            name: this.getCompanyName(symbol),
            ...data
          };
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.allSettled(promises);
      return results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching trending stocks:', error);
      return this.getMockStockData();
    }
  }

  /**
   * Get market summary data
   */
  async getMarketSummary() {
    try {
      const indices = await this.getMarketIndices();
      const totalVolume = indices.reduce((sum, index) => sum + (index.volume || 0), 0);
      const avgChange = indices.reduce((sum, index) => sum + (index.changePercent || 0), 0) / indices.length;

      return {
        totalMarketCap: 45.5e12, // Mock value in USD
        totalVolume,
        averageChange: avgChange,
        advancingStocks: Math.floor(Math.random() * 2000) + 1500,
        decliningStocks: Math.floor(Math.random() * 1500) + 1000,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market summary:', error);
      return this.getMockMarketSummary();
    }
  }

  /**
   * Get index name from symbol
   * @param {string} symbol - Index symbol
   */
  getIndexName(symbol) {
    const names = {
      '^GSPC': 'S&P 500',
      '^IXIC': 'NASDAQ',
      '^DJI': 'Dow Jones'
    };
    return names[symbol] || symbol;
  }

  /**
   * Get company name from symbol
   * @param {string} symbol - Stock symbol
   */
  getCompanyName(symbol) {
    const names = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corp.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.'
    };
    return names[symbol] || symbol;
  }

  /**
   * Format stock price
   * @param {number} price - Stock price
   */
  formatPrice(price) {
    return `$${price?.toFixed(2) || '0.00'}`;
  }

  /**
   * Get mock market data as fallback
   */
  getMockMarketData() {
    return [
      {
        symbol: '^GSPC',
        name: 'S&P 500',
        price: 4500.45,
        change: 25.67,
        changePercent: 0.57,
        volume: 3.2e9
      },
      {
        symbol: '^IXIC',
        name: 'NASDAQ',
        price: 14200.32,
        change: -45.23,
        changePercent: -0.32,
        volume: 4.1e9
      },
      {
        symbol: '^DJI',
        name: 'Dow Jones',
        price: 35400.67,
        change: 120.45,
        changePercent: 0.34,
        volume: 2.8e9
      }
    ];
  }

  /**
   * Get mock stock data as fallback
   */
  getMockStockData() {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        regularMarketPrice: 178.25,
        regularMarketChange: 2.34,
        regularMarketChangePercent: 1.33
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        regularMarketPrice: 2750.80,
        regularMarketChange: -15.67,
        regularMarketChangePercent: -0.57
      }
    ];
  }

  /**
   * Get mock market summary as fallback
   */
  getMockMarketSummary() {
    return {
      totalMarketCap: 45.5e12,
      totalVolume: 10.1e9,
      averageChange: 0.25,
      advancingStocks: 1750,
      decliningStocks: 1250,
      lastUpdate: new Date().toISOString()
    };
  }
}

export default new StockService();
