-- Create transactions table for financial transactions
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    type transaction_type NOT NULL,
    description TEXT,
    notes TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- For transfers, link to the destination transaction
    transfer_to_transaction_id INTEGER REFERENCES transactions(id),
    
    -- External reference for bank imports
    external_id VARCHAR(255),
    
    CONSTRAINT positive_expense_amount CHECK (
        (type = 'expense' AND amount > 0) OR 
        (type = 'income' AND amount > 0) OR 
        (type = 'transfer')
    )
);

-- Create indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_external_id ON transactions(external_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
