#!/bin/bash

# Finance App Deployment Script
echo "🚀 Starting deployment of Finance App..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI not found. Please install it first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    # Check if railway project is linked
    if [ ! -f "railway.json" ] && [ ! -f ".railway/config.json" ]; then
        print_warning "Railway project not linked. Please run 'railway login' and 'railway link' first."
        return 1
    fi
    
    # Deploy to Railway
    railway up --service backend || {
        print_error "Backend deployment failed"
        return 1
    }
    
    print_success "Backend deployed to Railway"
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd client || {
        print_error "Client directory not found"
        return 1
    }
    
    # Deploy to Vercel
    vercel --prod || {
        print_error "Frontend deployment failed"
        return 1
    }
    
    cd ..
    print_success "Frontend deployed to Vercel"
}

# Main deployment process
main() {
    print_status "Starting Finance App deployment process..."
    
    check_dependencies
    
    # Deploy backend first
    deploy_backend || exit 1
    
    # Wait a moment for backend to be ready
    print_status "Waiting for backend to be ready..."
    sleep 5
    
    # Deploy frontend
    deploy_frontend || exit 1
    
    print_success "🎉 Deployment completed successfully!"
    echo ""
    print_status "Your app should be available at:"
    echo "  Frontend: https://live-finance-app.vercel.app"
    echo "  Backend:  https://live-finance-app-backend.railway.app"
    echo "  Health:   https://live-finance-app-backend.railway.app/api/health"
}

# Run main function
main "$@"
