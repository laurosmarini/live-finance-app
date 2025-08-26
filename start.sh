#!/usr/bin/env bash
set -e

# Navigate to server directory and start the application
echo "Starting Finance App Backend..."
cd server
echo "Installing dependencies..."
npm install --production
echo "Starting server..."
npm start
