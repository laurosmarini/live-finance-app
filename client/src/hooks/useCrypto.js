import { useState, useEffect, useCallback } from 'react';
import cryptoService from '../services/cryptoService';

export const useCrypto = () => {
  const [topCoins, setTopCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [trending, setTrending] = useState([]);
  const [fearGreedIndex, setFearGreedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchTopCoins = useCallback(async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const coins = await cryptoService.getTopCoins(limit);
      setTopCoins(coins);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch top cryptocurrencies');
      console.error('Error fetching top coins:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGlobalData = useCallback(async () => {
    try {
      const data = await cryptoService.getGlobalData();
      setGlobalData(data);
    } catch (err) {
      console.error('Error fetching global data:', err);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const data = await cryptoService.getTrending();
      setTrending(data.coins || []);
    } catch (err) {
      console.error('Error fetching trending:', err);
    }
  }, []);

  const fetchFearGreedIndex = useCallback(async () => {
    try {
      const data = await cryptoService.getFearGreedIndex();
      setFearGreedIndex(data);
    } catch (err) {
      console.error('Error fetching fear & greed index:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchTopCoins(),
      fetchGlobalData(),
      fetchTrending(),
      fetchFearGreedIndex()
    ]);
  }, [fetchTopCoins, fetchGlobalData, fetchTrending, fetchFearGreedIndex]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    refreshData();
    
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    topCoins,
    globalData,
    trending,
    fearGreedIndex,
    loading,
    error,
    lastUpdate,
    refreshData,
    fetchTopCoins,
    formatPrice: cryptoService.formatPrice,
    formatLargeNumber: cryptoService.formatLargeNumber,
    getPriceChangeColor: cryptoService.getPriceChangeColor
  };
};

export const useCoinData = (coinId) => {
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoin = useCallback(async () => {
    if (!coinId) return;
    
    try {
      setLoading(true);
      setError(null);
      const [coinData, historyData] = await Promise.all([
        cryptoService.getCoinById(coinId),
        cryptoService.getCoinHistory(coinId, 'usd', 7)
      ]);
      setCoin(coinData);
      setHistory(historyData);
    } catch (err) {
      setError(`Failed to fetch ${coinId} data`);
      console.error(`Error fetching ${coinId}:`, err);
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  useEffect(() => {
    fetchCoin();
  }, [fetchCoin]);

  return {
    coin,
    history,
    loading,
    error,
    refetch: fetchCoin
  };
};

export const usePortfolio = (initialHoldings = []) => {
  const [holdings, setHoldings] = useState(initialHoldings);
  const [portfolioData, setPortfolioData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange24h, setTotalChange24h] = useState(0);
  const [loading, setLoading] = useState(false);

  const updatePortfolio = useCallback(async () => {
    if (holdings.length === 0) {
      setPortfolioData([]);
      setTotalValue(0);
      setTotalChange24h(0);
      return;
    }

    try {
      setLoading(true);
      const coinIds = holdings.map(h => h.coinId);
      const coinsData = await cryptoService.getCoinsByIds(coinIds);
      
      const portfolioWithData = holdings.map(holding => {
        const coinData = coinsData.find(c => c.id === holding.coinId);
        if (!coinData) return null;
        
        const currentValue = coinData.current_price * holding.quantity;
        const change24h = (coinData.price_change_percentage_24h / 100) * currentValue;
        
        return {
          ...holding,
          ...coinData,
          holdingValue: currentValue,
          holdingChange24h: change24h
        };
      }).filter(Boolean);
      
      const totalVal = portfolioWithData.reduce((sum, item) => sum + item.holdingValue, 0);
      const totalChg = portfolioWithData.reduce((sum, item) => sum + item.holdingChange24h, 0);
      
      setPortfolioData(portfolioWithData);
      setTotalValue(totalVal);
      setTotalChange24h(totalChg);
    } catch (err) {
      console.error('Error updating portfolio:', err);
    } finally {
      setLoading(false);
    }
  }, [holdings]);

  const addHolding = useCallback((coinId, quantity, avgBuyPrice) => {
    setHoldings(prev => [
      ...prev,
      { coinId, quantity, avgBuyPrice, id: Date.now() }
    ]);
  }, []);

  const removeHolding = useCallback((holdingId) => {
    setHoldings(prev => prev.filter(h => h.id !== holdingId));
  }, []);

  const updateHolding = useCallback((holdingId, updates) => {
    setHoldings(prev => prev.map(h => 
      h.id === holdingId ? { ...h, ...updates } : h
    ));
  }, []);

  useEffect(() => {
    updatePortfolio();
  }, [updatePortfolio]);

  return {
    holdings,
    portfolioData,
    totalValue,
    totalChange24h,
    loading,
    addHolding,
    removeHolding,
    updateHolding,
    refreshPortfolio: updatePortfolio
  };
};
