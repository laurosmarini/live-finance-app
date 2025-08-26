# Finance App

A full-stack personal finance management application built with React and Express.js.

## 🌟 Features

- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Financial Accounts**: Manage multiple bank accounts, credit cards, and investment accounts
- **Transaction Tracking**: Record and categorize income and expenses
- **Budget Management**: Create and monitor budgets by category
- **Cryptocurrency Portfolio**: Track crypto holdings with real-time prices via CoinGecko
- **Data Visualization**: Interactive charts showing spending patterns and account balances
- **Responsive Design**: Modern, mobile-first UI with dark/light mode support

## 🏗️ Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Hook Form** - Form handling

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **Knex.js** - Query builder and migrations
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Helmet** - Security middleware

### DevOps & Tools
- **Concurrently** - Run frontend and backend simultaneously
- **Jest** - Testing framework
- **ESLint** - Code linting

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd finance-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client and server dependencies
npm run install-deps
```

### 3. Set Up Environment Variables
Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL=postgresql://finance_user:password123@localhost:5432/finance_app

# JWT Secrets (generate secure keys for production)
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here

# External APIs
COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

### 4. Set Up Database

#### Option A: Manual PostgreSQL Setup
1. Install PostgreSQL on your system
2. Create a database and user:
```sql
CREATE USER finance_user WITH PASSWORD 'password123';
CREATE DATABASE finance_app OWNER finance_user;
GRANT ALL PRIVILEGES ON DATABASE finance_app TO finance_user;
```

#### Option B: Docker Setup
```bash
docker run --name postgres-finance \\
  -e POSTGRES_USER=finance_user \\
  -e POSTGRES_PASSWORD=password123 \\
  -e POSTGRES_DB=finance_app \\
  -p 5432:5432 \\
  -d postgres:15
```

### 5. Run Database Migrations
```bash
cd db
npm install
npm run setup  # This runs migrations and seeds
```

### 6. Start the Application
```bash
# From the root directory
npm run dev
```

This starts both the frontend (http://localhost:3000) and backend (http://localhost:5000).

## 📁 Project Structure

```
finance-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── pages/          # Page components
│   │   ├── styles/         # Global styles and theme
│   │   └── utils/          # Helper functions
│   ├── package.json
│   └── .env
├── server/                 # Express.js backend
│   ├── config/             # Database and app configuration
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route handlers
│   ├── utils/              # Helper functions
│   ├── package.json
│   └── index.js
├── db/                     # Database files
│   ├── migrations/         # Database migrations
│   ├── seeds/              # Seed data
│   ├── knexfile.js         # Knex configuration
│   └── package.json
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json            # Root package configuration
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Health Check
- `GET /api/health` - Server health status

*Additional endpoints for accounts, transactions, budgets, and crypto are in development.*

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Hashed password
- `first_name`, `last_name` - User name
- `created_at`, `updated_at` - Timestamps
- `is_active` - Account status

### Accounts Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Account name
- `type` - Account type (checking, savings, etc.)
- `balance` - Current balance
- `currency` - Currency code

### Transactions Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `account_id` - Foreign key to accounts
- `amount` - Transaction amount
- `type` - Transaction type (income/expense/transfer)
- `description` - Transaction description
- `transaction_date` - Date of transaction

### Categories Table
- `id` - Primary key
- `name` - Category name
- `description` - Category description
- `color` - UI color
- `user_id` - Foreign key (null for default categories)

## 🧪 Testing

### Run Backend Tests
```bash
cd server
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

### Run All Tests
```bash
npm test
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Add environment variables in Vercel dashboard

### Backend (Railway/Render)
1. Connect your GitHub repo to Railway or Render
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add PostgreSQL database addon
5. Configure environment variables

## 🔧 Development

### Database Operations
```bash
cd db

# Create new migration
npm run migrate:make migration_name

# Run migrations
npm run migrate:latest

# Rollback migration
npm run migrate:rollback

# Create seed file
npm run seed:make seed_name

# Run seeds
npm run seed:run

# Reset database (rollback all + migrate + seed)
npm run reset
```

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database and user exist

**Frontend Won't Start**
- Clear node_modules and reinstall
- Check for port conflicts
- Verify all dependencies are installed

**API Requests Failing**
- Check backend server is running on port 5000
- Verify proxy setting in client/package.json
- Check CORS configuration

**JWT Token Issues**
- Ensure JWT_SECRET is set in .env
- Check token expiration times
- Clear localStorage and login again

## 📝 License

This project is licensed under the MIT License.

---

**Happy coding! 💻✨**
