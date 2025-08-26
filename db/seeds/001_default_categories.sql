-- Insert default categories that will be available to all users
INSERT INTO categories (name, description, color, icon, is_default) VALUES
-- Income Categories
('Salary', 'Regular salary and wages', '#22c55e', 'dollar-sign', true),
('Freelance', 'Freelance and contract work', '#10b981', 'briefcase', true),
('Investment', 'Investment returns and dividends', '#059669', 'trending-up', true),
('Gift', 'Money received as gifts', '#84cc16', 'gift', true),
('Other Income', 'Other sources of income', '#65a30d', 'plus-circle', true),

-- Expense Categories
('Food & Dining', 'Restaurants, groceries, and food delivery', '#ef4444', 'utensils', true),
('Transportation', 'Gas, public transport, car maintenance', '#f97316', 'car', true),
('Shopping', 'Clothing, electronics, and general shopping', '#8b5cf6', 'shopping-bag', true),
('Entertainment', 'Movies, games, subscriptions', '#ec4899', 'play-circle', true),
('Bills & Utilities', 'Rent, electricity, internet, phone', '#06b6d4', 'file-text', true),
('Healthcare', 'Medical expenses, insurance, pharmacy', '#14b8a6', 'heart', true),
('Education', 'Books, courses, tuition', '#3b82f6', 'book-open', true),
('Travel', 'Flights, hotels, vacation expenses', '#6366f1', 'map-pin', true),
('Home & Garden', 'Home improvement, furniture, garden', '#a855f7', 'home', true),
('Personal Care', 'Haircuts, cosmetics, gym membership', '#d946ef', 'user', true),
('Insurance', 'Life, health, car insurance', '#64748b', 'shield', true),
('Taxes', 'Income tax, property tax', '#475569', 'calculator', true),
('Savings', 'Money saved or invested', '#22c55e', 'piggy-bank', true),
('Other Expenses', 'Miscellaneous expenses', '#6b7280', 'more-horizontal', true);
