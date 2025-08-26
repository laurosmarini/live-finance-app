#!/bin/bash

# Finance App Setup Script
# This script helps set up the Finance App development environment

echo "🏦 Finance App Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm detected"

# Check if PostgreSQL is running
if command -v psql &> /dev/null; then
    if pg_isready &> /dev/null; then
        echo "✅ PostgreSQL is running"
    else
        echo "⚠️  PostgreSQL is installed but not running"
        echo "   Please start PostgreSQL service"
    fi
else
    echo "⚠️  PostgreSQL not detected"
    echo "   You can install it manually or use Docker:"
    echo "   docker run --name postgres-finance -e POSTGRES_USER=finance_user -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=finance_app -p 5432:5432 -d postgres:15"
fi

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install && cd ..

# Install server dependencies  
echo "Installing server dependencies..."
cd server && npm install && cd ..

# Install database dependencies
echo "Installing database dependencies..."
cd db && npm install && cd ..

echo ""
echo "⚙️  Setting up environment..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from template"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Create client .env file if it doesn't exist
if [ ! -f client/.env ]; then
    echo "Creating client/.env file..."
    echo "REACT_APP_BACKEND_URL=http://localhost:5000" > client/.env
    echo "REACT_APP_COINGECKO_API=https://api.coingecko.com/api/v3" >> client/.env
    echo "GENERATE_SOURCEMAP=false" >> client/.env
    echo "✅ client/.env file created"
fi

echo ""
echo "🗄️  Database setup..."

# Check if we can connect to the database
if command -v psql &> /dev/null && pg_isready &> /dev/null; then
    echo "Setting up database..."
    cd db
    
    # Run migrations
    if npm run migrate:latest; then
        echo "✅ Database migrations completed"
        
        # Run seeds
        if npm run seed:run; then
            echo "✅ Database seeded successfully"
        else
            echo "⚠️  Database seeding failed - you may need to run this manually"
        fi
    else
        echo "⚠️  Database migrations failed"
        echo "   Please check your database connection and run manually:"
        echo "   cd db && npm run migrate:latest && npm run seed:run"
    fi
    cd ..
else
    echo "⚠️  Skipping database setup - PostgreSQL not available"
    echo "   After setting up PostgreSQL, run:"
    echo "   cd db && npm run setup"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Make sure PostgreSQL is running"
echo "3. Run database migrations if not done: cd db && npm run setup"
echo "4. Start the development servers: npm run dev"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "   This will start:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend: http://localhost:5000"
echo ""
echo "📖 Read README.md for more information"
echo ""
echo "Happy coding! 💻✨"
