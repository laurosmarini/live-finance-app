import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
`;

const glow = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: #22c55e;
  backdrop-filter: blur(10px);
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
`;

const UpdateText = styled.span`
  animation: ${glow} 2s infinite;
`;

const PriceChangeIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  background: ${({ isPositive }) => isPositive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${({ isPositive }) => isPositive ? '#22c55e' : '#ef4444'};
  border: 1px solid ${({ isPositive }) => isPositive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  backdrop-filter: blur(10px);
  
  .arrow {
    font-size: 12px;
  }
`;

const LiveMarketStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  background: ${({ isOpen }) => isOpen 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'
  };
  border: 1px solid ${({ isOpen }) => isOpen 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(239, 68, 68, 0.3)'
  };
  border-radius: ${({ theme }) => theme.radii.lg};
  backdrop-filter: blur(10px);
  
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ isOpen }) => isOpen ? '#22c55e' : '#ef4444'};
    animation: ${({ isOpen }) => isOpen ? pulse : 'none'} 2s infinite;
  }
  
  .status-text {
    color: ${({ isOpen }) => isOpen ? '#22c55e' : '#ef4444'};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const LastUpdateTime = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  
  .refresh-icon {
    animation: ${({ isRefreshing }) => isRefreshing ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const LiveIndicator = ({ 
  isLive = true, 
  text = 'LIVE',
  size = 'sm' 
}) => (
  <LiveBadge>
    <LiveDot />
    <UpdateText>{text}</UpdateText>
  </LiveBadge>
);

export const PriceChange = ({ 
  value, 
  isPositive, 
  prefix = '', 
  suffix = '%',
  showArrow = true 
}) => (
  <PriceChangeIndicator isPositive={isPositive}>
    {showArrow && <span className="arrow">{isPositive ? '↗' : '↘'}</span>}
    {prefix}{Math.abs(value).toFixed(2)}{suffix}
  </PriceChangeIndicator>
);

export const MarketStatus = ({ 
  isOpen, 
  marketName = 'Market',
  nextOpenTime 
}) => {
  const getStatusText = () => {
    if (isOpen) return `${marketName} Open`;
    if (nextOpenTime) {
      const hours = Math.floor((nextOpenTime - new Date()) / (1000 * 60 * 60));
      if (hours > 0) return `Opens in ${hours}h`;
    }
    return `${marketName} Closed`;
  };

  return (
    <LiveMarketStatus isOpen={isOpen}>
      <div className="status-dot" />
      <span className="status-text">{getStatusText()}</span>
    </LiveMarketStatus>
  );
};

export const LastUpdated = ({ 
  lastUpdate, 
  isRefreshing = false,
  refreshInterval = 30 
}) => {
  const getTimeAgo = () => {
    if (!lastUpdate) return 'Never';
    const now = new Date();
    const diff = now - lastUpdate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (seconds < 30) return 'Just now';
    if (minutes < 1) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <LastUpdateTime isRefreshing={isRefreshing}>
      <span className="refresh-icon">🔄</span>
      Last updated: {getTimeAgo()} • Refreshes every {refreshInterval}s
    </LastUpdateTime>
  );
};

export default LiveIndicator;
