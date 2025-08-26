-- Create crypto_holdings table for cryptocurrency portfolio tracking
CREATE TABLE crypto_holdings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL, -- e.g., 'BTC', 'ETH'
    name VARCHAR(100) NOT NULL, -- e.g., 'Bitcoin', 'Ethereum'
    quantity DECIMAL(20,8) NOT NULL CHECK (quantity >= 0),
    average_buy_price DECIMAL(15,2) DEFAULT 0,
    current_price DECIMAL(15,2) DEFAULT 0,
    last_price_update TIMESTAMP WITH TIME ZONE,
    coingecko_id VARCHAR(100), -- for API integration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique holdings per symbol per user per account
    UNIQUE(user_id, account_id, symbol)
);

-- Create indexes
CREATE INDEX idx_crypto_holdings_user_id ON crypto_holdings(user_id);
CREATE INDEX idx_crypto_holdings_account_id ON crypto_holdings(account_id);
CREATE INDEX idx_crypto_holdings_symbol ON crypto_holdings(symbol);
CREATE INDEX idx_crypto_holdings_coingecko_id ON crypto_holdings(coingecko_id);
