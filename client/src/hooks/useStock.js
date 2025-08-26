import { useState, useEffect, useCallback } from 'react';
import stockService from '../services/stockService';

export const useStock = () => {
  const [marketIndices, setMarketIndices] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchMarketIndices = useCallback(async () => {
    try {
      const indices = await stockService.getMarketIndices();
      setMarketIndices(indices);
    } catch (err) {
      console.error('Error fetching market indices:', err);
    }
  }, []);

  const fetchMarketSummary = useCallback(async () => {
    try {
      const summary = await stockService.getMarketSummary();
      setMarketSummary(summary);
    } catch (err) {
      console.error('Error fetching market summary:', err);
    }
  }, []);

  const fetchTrendingStocks = useCallback(async () => {
    try {
      const stocks = await stockService.getTrendingStocks();
      setTrendingStocks(stocks);
    } catch (err) {
      console.error('Error fetching trending stocks:', err);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchMarketIndices(),
        fetchMarketSummary(),
        fetchTrendingStocks()
      ]);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch stock market data');
    } finally {
      setLoading(false);
    }
  }, [fetchMarketIndices, fetchMarketSummary, fetchTrendingStocks]);

  // Auto-refresh data every 60 seconds (stock markets update less frequently)
  useEffect(() => {
    refreshData();
    
    const interval = setInterval(() => {
      refreshData();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    marketIndices,
    marketSummary,
    trendingStocks,
    loading,
    error,
    lastUpdate,
    refreshData,
    formatPrice: stockService.formatPrice
  };
};

export const useMarketStatus = () => {
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [nextOpenTime, setNextOpenTime] = useState(null);
  const [timeZone, setTimeZone] = useState('EST');

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
      const day = nyTime.getDay(); // 0 = Sunday, 6 = Saturday
      const hours = nyTime.getHours();
      const minutes = nyTime.getMinutes();
      const currentTime = hours * 60 + minutes; // Convert to minutes

      // Market is open Monday-Friday, 9:30 AM - 4:00 PM EST
      const isWeekday = day >= 1 && day <= 5;
      const marketOpen = 9 * 60 + 30; // 9:30 AM in minutes
      const marketClose = 16 * 60; // 4:00 PM in minutes
      const isOpen = isWeekday && currentTime >= marketOpen && currentTime < marketClose;

      setIsMarketOpen(isOpen);

      // Calculate next open time
      if (!isOpen) {
        let nextOpen = new Date(nyTime);
        if (day === 0) { // Sunday
          nextOpen.setDate(nextOpen.getDate() + 1); // Monday
        } else if (day === 6) { // Saturday
          nextOpen.setDate(nextOpen.getDate() + 2); // Monday
        } else if (currentTime >= marketClose) { // After market close
          nextOpen.setDate(nextOpen.getDate() + 1); // Next day
        }
        
        nextOpen.setHours(9, 30, 0, 0); // Set to 9:30 AM
        setNextOpenTime(nextOpen);
      } else {
        setNextOpenTime(null);
      }
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    isMarketOpen,
    nextOpenTime,
    timeZone
  };
};
