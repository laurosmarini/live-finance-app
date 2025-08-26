-- Create budgets table for budget management
CREATE TYPE budget_period AS ENUM ('weekly', 'monthly', 'quarterly', 'yearly');

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    period budget_period NOT NULL DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure no overlapping budgets for same category and period
    EXCLUDE USING gist (
        user_id WITH =,
        category_id WITH =,
        period WITH =,
        daterange(start_date, COALESCE(end_date, 'infinity'::date), '[]') WITH &&
    ) WHERE (is_active = true)
);

-- Create indexes
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_period ON budgets(period);
CREATE INDEX idx_budgets_dates ON budgets(start_date, end_date);
CREATE INDEX idx_budgets_is_active ON budgets(is_active);
