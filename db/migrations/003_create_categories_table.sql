-- Create categories table for transaction categorization
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- hex color code
    icon VARCHAR(50), -- icon name or class
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false, -- for system-default categories
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique category names per user (or unique default categories)
    UNIQUE(name, user_id)
);

-- Create indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_is_default ON categories(is_default);
