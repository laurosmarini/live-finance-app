import axios from 'axios';

const COINGECKO_API = process.env.REACT_APP_COINGECKO_API || 'https://api.coingecko.com/api/v3';

// Create axios instance for CoinGecko API
const cryptoAPI = axios.create({
  baseURL: COINGECKO_API,
  timeout: 10000,
});

class CryptoService {
  /**
   * Get trending cryptocurrencies
   */
  async getTrending() {
    try {
      const response = await cryptoAPI.get('/search/trending');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending crypto:', error);
      throw error;
    }
  }

  /**
   * Get top cryptocurrencies by market cap
   * @param {number} limit - Number of coins to fetch (default: 10)
   * @param {string} currency - Currency for prices (default: 'usd')
   */
  async getTopCoins(limit = 10, currency = 'usd') {
    try {
      const response = await cryptoAPI.get('/coins/markets', {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: true,
          price_change_percentage: '1h,24h,7d'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top coins:', error);
      throw error;
    }
  }

  /**
   * Get specific coin data by ID
   * @param {string} coinId - CoinGecko coin ID
   * @param {string} currency - Currency for prices (default: 'usd')
   */
  async getCoinById(coinId, currency = 'usd') {
    try {
      const response = await cryptoAPI.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching coin ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple coins data by IDs
   * @param {string[]} coinIds - Array of CoinGecko coin IDs
   * @param {string} currency - Currency for prices (default: 'usd')
   */
  async getCoinsByIds(coinIds, currency = 'usd') {
    try {
      const response = await cryptoAPI.get('/coins/markets', {
        params: {
          ids: coinIds.join(','),
          vs_currency: currency,
          order: 'market_cap_desc',
          sparkline: true,
          price_change_percentage: '1h,24h,7d'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching coins by IDs:', error);
      throw error;
    }
  }

  /**
   * Get global cryptocurrency market data
   */
  async getGlobalData() {
    try {
      const response = await cryptoAPI.get('/global');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching global crypto data:', error);
      throw error;
    }
  }

  /**
   * Get coin price history (simplified)
   * @param {string} coinId - CoinGecko coin ID
   * @param {string} currency - Currency for prices (default: 'usd')
   * @param {number} days - Number of days of data (default: 7)
   */
  async getCoinHistory(coinId, currency = 'usd', days = 7) {
    try {
      const response = await cryptoAPI.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: currency,
          days: days,
          interval: days <= 1 ? 'hourly' : 'daily'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${coinId} history:`, error);
      throw error;
    }
  }

  /**
   * Search for cryptocurrencies
   * @param {string} query - Search query
   */
  async searchCoins(query) {
    try {
      const response = await cryptoAPI.get('/search', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching coins:', error);
      throw error;
    }
  }

  /**
   * Get fear and greed index from Alternative.me API
   */
  async getFearGreedIndex() {
    try {
      const response = await axios.get('https://api.alternative.me/fng/');
      const data = response.data?.data?.[0];
      
      if (!data) {
        throw new Error('No fear & greed data available');
      }
      
      return {
        value: parseInt(data.value),
        classification: data.value_classification,
        timestamp: data.timestamp,
        time_until_update: data.time_until_update || null
      };
    } catch (error) {
      console.error('Error fetching fear & greed index:', error);
      // Fallback to mock data if API fails
      const mockValue = Math.floor(Math.random() * 100);
      return {
        value: mockValue,
        classification: this.classifyFearGreed(mockValue),
        timestamp: Math.floor(Date.now() / 1000).toString(),
        time_until_update: null,
        isMock: true
      };
    }
  }

  /**
   * Classify fear and greed index value
   * @param {number} value - Fear & greed index value (0-100)
   */
  classifyFearGreed(value) {
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
  }

  /**
   * Format large numbers for display
   * @param {number} num - Number to format
   */
  formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  }

  /**
   * Format price for display
   * @param {number} price - Price to format
   * @param {string} currency - Currency symbol
   */
  formatPrice(price, currency = '$') {
    if (price >= 1) {
      return `${currency}${price.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
    
    // For prices less than $1, show more decimal places
    const decimals = price >= 0.01 ? 4 : 6;
    return `${currency}${price.toFixed(decimals)}`;
  }

  /**
   * Get color based on price change percentage
   * @param {number} changePercentage - Price change percentage
   */
  getPriceChangeColor(changePercentage) {
    if (changePercentage > 0) return '#22c55e'; // green
    if (changePercentage < 0) return '#ef4444'; // red
    return '#6b7280'; // gray
  }
}

export default new CryptoService();
