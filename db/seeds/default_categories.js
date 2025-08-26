/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing default categories
  await knex('categories').where('is_default', true).del();
  
  // Insert default categories
  await knex('categories').insert([
    // Income Categories
    { name: 'Salary', description: 'Regular salary and wages', color: '#22c55e', icon: 'dollar-sign', is_default: true },
    { name: 'Freelance', description: 'Freelance and contract work', color: '#10b981', icon: 'briefcase', is_default: true },
    { name: 'Investment', description: 'Investment returns and dividends', color: '#059669', icon: 'trending-up', is_default: true },
    { name: 'Gift', description: 'Money received as gifts', color: '#84cc16', icon: 'gift', is_default: true },
    { name: 'Other Income', description: 'Other sources of income', color: '#65a30d', icon: 'plus-circle', is_default: true },
    
    // Expense Categories
    { name: 'Food & Dining', description: 'Restaurants, groceries, and food delivery', color: '#ef4444', icon: 'utensils', is_default: true },
    { name: 'Transportation', description: 'Gas, public transport, car maintenance', color: '#f97316', icon: 'car', is_default: true },
    { name: 'Shopping', description: 'Clothing, electronics, and general shopping', color: '#8b5cf6', icon: 'shopping-bag', is_default: true },
    { name: 'Entertainment', description: 'Movies, games, subscriptions', color: '#ec4899', icon: 'play-circle', is_default: true },
    { name: 'Bills & Utilities', description: 'Rent, electricity, internet, phone', color: '#06b6d4', icon: 'file-text', is_default: true },
    { name: 'Healthcare', description: 'Medical expenses, insurance, pharmacy', color: '#14b8a6', icon: 'heart', is_default: true },
    { name: 'Education', description: 'Books, courses, tuition', color: '#3b82f6', icon: 'book-open', is_default: true },
    { name: 'Travel', description: 'Flights, hotels, vacation expenses', color: '#6366f1', icon: 'map-pin', is_default: true },
    { name: 'Home & Garden', description: 'Home improvement, furniture, garden', color: '#a855f7', icon: 'home', is_default: true },
    { name: 'Personal Care', description: 'Haircuts, cosmetics, gym membership', color: '#d946ef', icon: 'user', is_default: true },
    { name: 'Insurance', description: 'Life, health, car insurance', color: '#64748b', icon: 'shield', is_default: true },
    { name: 'Taxes', description: 'Income tax, property tax', color: '#475569', icon: 'calculator', is_default: true },
    { name: 'Savings', description: 'Money saved or invested', color: '#22c55e', icon: 'piggy-bank', is_default: true },
    { name: 'Other Expenses', description: 'Miscellaneous expenses', color: '#6b7280', icon: 'more-horizontal', is_default: true }
  ]);
};
