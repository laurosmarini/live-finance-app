# Finance App Deployment Guide

This document provides comprehensive instructions for deploying the Finance App to various cloud platforms.

## 🚀 Deployment Status

### ✅ Frontend - Vercel
- **Status**: ✅ Deployed
- **URL**: https://finance-app-frontend-9pbbsgbjy-laurosmarinis-projects.vercel.app
- **Platform**: Vercel
- **Framework**: React (Create React App)

### 🔄 Backend - Multiple Options Available

The backend can be deployed to several platforms. Choose the one that fits your needs:

## Deployment Options

### Option 1: Railway (Recommended)

Railway provides excellent Node.js hosting with built-in database support.

#### Setup Steps:
1. **Create Railway Account**: Visit [railway.app](https://railway.app) and sign up
2. **Install Railway CLI**: Already installed locally
3. **Deploy**:
   ```bash
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   
   # Deploy
   railway up
   ```

#### Configuration:
- Deployment config in `railway.toml`
- Health check endpoint: `/api/health`
- Automatic SSL certificates
- Environment variables managed through Railway dashboard

### Option 2: Render

Render provides free hosting for Node.js applications.

#### Setup Steps:
1. **Create Render Account**: Visit [render.com](https://render.com) and sign up
2. **Connect GitHub**: Link your `live-finance-app` repository
3. **Deploy**: Use the `render.yaml` configuration file
4. **Configure Environment Variables**:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secret-key`
   - `JWT_REFRESH_SECRET=your-refresh-secret`
   - `DATABASE_URL=your-database-url`

### Option 3: Docker Deployment

For any platform supporting Docker containers.

#### Setup Steps:
```bash
# Build the Docker image
cd server
docker build -t finance-app-backend .

# Run locally for testing
docker run -p 5000:5000 -e NODE_ENV=production finance-app-backend

# Deploy to your preferred container platform
```

## Environment Variables

### Required Backend Variables:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COINGECKO_API_URL=https://api.coingecko.com/api/v3
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Optional Database Variables:
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

## Frontend Configuration

The frontend is automatically configured to use the deployed backend URL. Update `client/vercel.json` if you deploy the backend to a different URL.

Current backend URL: `https://live-finance-app-backend.railway.app`

## CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/deploy.yml`) for automatic deployment:

- **Triggers**: Push to `main` branch
- **Tests**: Runs client and server tests
- **Frontend**: Auto-deploys to Vercel
- **Backend**: Auto-deploys to Railway (requires secrets)

### Required GitHub Secrets:
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
RAILWAY_TOKEN=your-railway-token
```

## Database Setup

### Development:
```bash
cd db
npm install
npm run migrate:latest
npm run seed:run
```

### Production:
The database migrations and seeds will be automatically run during Railway deployment.

## Monitoring & Health Checks

### Health Check Endpoint:
- **URL**: `https://your-backend-domain.com/api/health`
- **Response**: 
  ```json
  {
    "status": "OK",
    "message": "Finance App API is running",
    "timestamp": "2025-08-26T05:41:00.000Z",
    "environment": "production",
    "version": "1.0.0"
  }
  ```

### Security Features:
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting (100 requests/15 minutes)
- ✅ Environment-based configuration
- ✅ JWT authentication
- ✅ Input validation with Joi

## Local Development

### Prerequisites:
- Node.js 20+
- PostgreSQL (for database)

### Setup:
```bash
# Install dependencies
npm run install-deps

# Start development servers
npm run dev

# Or individually:
npm run client  # Frontend on port 3000
npm run server  # Backend on port 5000
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Update `CORS_ORIGIN` environment variable
   - Check frontend URL in backend configuration

2. **Database Connection**:
   - Verify `DATABASE_URL` format
   - Run migrations: `npm run migrate:latest`

3. **Authentication Issues**:
   - Check JWT secrets are properly set
   - Verify token expiration times

4. **Build Failures**:
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall

## Support

For deployment issues:
1. Check the GitHub Actions logs
2. Review platform-specific logs (Vercel/Railway/Render)
3. Verify environment variables
4. Test health check endpoints

## Next Steps

1. **Custom Domain**: Configure custom domain in Vercel dashboard
2. **Database**: Set up PostgreSQL database on Railway or external provider
3. **Monitoring**: Add application monitoring (e.g., Sentry)
4. **Analytics**: Implement user analytics
5. **Performance**: Enable caching and CDN

---

**Happy Deploying! 🚀**
