import React from 'react';
import styled from 'styled-components';
import { useCrypto } from '../hooks/useCrypto';
import { useStock, useMarketStatus } from '../hooks/useStock';
import GlassCard, { ValueDisplay, ChangeIndicator, LoadingPulse } from '../components/UI/GlassCard';
import { LiveIndicator, PriceChange, MarketStatus, LastUpdated } from '../components/UI/LiveIndicator';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gradients.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
    animation: float 25s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[12]};
  
  h1 {
    font-size: ${({ theme }) => theme.fontSizes['5xl']};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: white;
    margin-bottom: ${({ theme }) => theme.space[4]};
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: rgba(255, 255, 255, 0.8);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const CryptoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[8]};
`;

const CoinItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: ${({ theme }) => theme.space[3]};
  }
  
  .name {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: white;
    margin-bottom: 2px;
  }
  
  .symbol {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
  }
`;

const CoinPrice = styled.div`
  text-align: right;
  
  .price {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: white;
    margin-bottom: 2px;
  }
  
  .change {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ isPositive }) => isPositive ? '#22c55e' : '#ef4444'};
  }
`;

const LastUpdate = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[4]};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.radii.lg};
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.7);
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

function Dashboard() {
  const { 
    topCoins, 
    globalData,
    fearGreedIndex,
    loading: cryptoLoading, 
    error: cryptoError, 
    lastUpdate: cryptoLastUpdate,
    formatPrice,
    formatLargeNumber
  } = useCrypto();
  
  const {
    marketIndices,
    marketSummary,
    loading: stockLoading,
    error: stockError,
    lastUpdate: stockLastUpdate
  } = useStock();
  
  const { isMarketOpen, nextOpenTime } = useMarketStatus();
  
  const formatTimeAgo = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <DashboardContainer>
      <Container>
        <Header>
          <h1>Crypto Finance Dashboard</h1>
          <p>Real-time cryptocurrency data, portfolio tracking, and market insights</p>
        </Header>

        <Grid>
          <GlassCard
            title="Market Overview"
            subtitle="Global crypto market statistics"
            icon="🌍"
            iconColor={`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}
            gradient={`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}
          >
            {cryptoLoading ? (
              <div>
                <LoadingPulse height="30px" />
                <LoadingPulse height="20px" width="60%" />
              </div>
            ) : globalData ? (
              <div>
                <ValueDisplay size="large">
                  ${formatLargeNumber(globalData.total_market_cap?.usd || 0)}
                </ValueDisplay>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Total Market Cap</p>
                <div style={{ marginTop: '16px' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '4px 0' }}>
                    24h Volume: ${formatLargeNumber(globalData.total_volume?.usd || 0)}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '4px 0' }}>
                    Active Cryptocurrencies: {globalData.active_cryptocurrencies?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p>Failed to load market data</p>
            )}
          </GlassCard>

          <GlassCard
            title="Bitcoin Dominance"
            subtitle="BTC market share"
            icon="₿"
            iconColor={`linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`}
            gradient={`linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`}
          >
            {cryptoLoading ? (
              <LoadingPulse height="60px" />
            ) : globalData ? (
              <div>
                <ValueDisplay size="xl">
                  {globalData.market_cap_percentage?.btc?.toFixed(1) || '0'}%
                </ValueDisplay>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Market Dominance</p>
                {topCoins[0] && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Bitcoin Price: {formatPrice(topCoins[0].current_price)}
                    </p>
                    <ChangeIndicator isPositive={topCoins[0].price_change_percentage_24h > 0}>
                      {topCoins[0].price_change_percentage_24h?.toFixed(2) || 0}%
                    </ChangeIndicator>
                  </div>
                )}
              </div>
            ) : (
              <p>Failed to load BTC data</p>
            )}
          </GlassCard>

          <GlassCard
            title="Portfolio Value"
            subtitle="Your crypto holdings"
            icon="💎"
            iconColor={`linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`}
            gradient={`linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`}
          >
            <ValueDisplay size="large">
              $12,456.78
            </ValueDisplay>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Total Portfolio</p>
            <div style={{ marginTop: '16px' }}>
              <ChangeIndicator isPositive={true}>
                +8.45% (24h)
              </ChangeIndicator>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '8px', fontSize: '14px' }}>
                Gain: +$972.34
              </p>
            </div>
          </GlassCard>

          <GlassCard
            title="Fear & Greed Index"
            subtitle="Market sentiment"
            icon="📊"
            iconColor={`linear-gradient(135deg, #fa709a 0%, #fee140 100%)`}
            gradient={`linear-gradient(135deg, #fa709a 0%, #fee140 100%)`}
          >
            {cryptoLoading ? (
              <LoadingPulse height="60px" />
            ) : fearGreedIndex ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ValueDisplay size="xl">
                    {fearGreedIndex.value}
                  </ValueDisplay>
                  <LiveIndicator text="LIVE" />
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  {fearGreedIndex.classification}{fearGreedIndex.isMock ? ' (Mock)' : ''}
                </p>
                <div style={{ marginTop: '16px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${fearGreedIndex.value}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #ef4444, #f59e0b, #22c55e)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginTop: '8px', fontSize: '14px' }}>
                    {fearGreedIndex.value <= 25 && 'Extreme fear dominates the market'}
                    {fearGreedIndex.value > 25 && fearGreedIndex.value <= 45 && 'Fear is present in the market'}
                    {fearGreedIndex.value > 45 && fearGreedIndex.value <= 55 && 'Market sentiment is neutral'}
                    {fearGreedIndex.value > 55 && fearGreedIndex.value <= 75 && 'Greed is building up'}
                    {fearGreedIndex.value > 75 && 'Extreme greed in the market'}
                  </p>
                </div>
              </div>
            ) : (
              <p>Failed to load Fear & Greed data</p>
            )}
          </GlassCard>
          
          <GlassCard
            title="Stock Market"
            subtitle="Major indices"
            icon="📈"
            iconColor={`linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`}
            gradient={`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MarketStatus isOpen={isMarketOpen} marketName="US Market" nextOpenTime={nextOpenTime} />
            </div>
            
            {stockLoading ? (
              <div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <LoadingPulse height="30px" />
                  </div>
                ))}
              </div>
            ) : marketIndices.length > 0 ? (
              <div>
                {marketIndices.map((index, i) => (
                  <div key={index.symbol} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: i < marketIndices.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                  }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                        {index.name}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                        {index.symbol}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                        {index.price ? index.price.toFixed(2) : 'N/A'}
                      </div>
                      <PriceChange 
                        value={index.changePercent || 0} 
                        isPositive={index.changePercent > 0}
                        showArrow={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Market data unavailable</p>
            )}
          </GlassCard>
        </Grid>

        {/* Top Cryptocurrencies */}
        <GlassCard title="Top Cryptocurrencies" subtitle="Live market data">
          {cryptoLoading ? (
            <div>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <LoadingPulse height="40px" />
                </div>
              ))}
            </div>
          ) : cryptoError ? (
            <p style={{ color: '#ef4444', textAlign: 'center' }}>{cryptoError}</p>
          ) : (
            <CryptoGrid>
              {topCoins.slice(0, 8).map((coin, index) => (
                <CoinItem key={coin.id}>
                  <CoinInfo>
                    <img src={coin.image} alt={coin.name} />
                    <div>
                      <div className="name">#{index + 1} {coin.name}</div>
                      <div className="symbol">{coin.symbol}</div>
                    </div>
                  </CoinInfo>
                  <CoinPrice isPositive={coin.price_change_percentage_24h > 0}>
                    <div className="price">{formatPrice(coin.current_price)}</div>
                    <div className="change">
                      {coin.price_change_percentage_24h > 0 ? '↗' : '↘'}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </CoinPrice>
                </CoinItem>
              ))}
            </CryptoGrid>
          )}
        </GlassCard>

        {cryptoLastUpdate && (
          <LastUpdate>
            🔄 Last updated: {formatTimeAgo(cryptoLastUpdate)} • Crypto data refreshes every 30s, Stock data every 60s
          </LastUpdate>
        )}
      </Container>
    </DashboardContainer>
  );
}

export default Dashboard;
