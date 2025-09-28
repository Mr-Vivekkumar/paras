#!/bin/bash

echo "🚀 Setting up Menu Management Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your database credentials."
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client found"
else
    echo "⚠️  PostgreSQL client not found. Please install PostgreSQL."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Create PostgreSQL database: createdb menu_management"
echo "3. Start the application: npm run start:dev"
echo ""
echo "The backend will be available at: http://localhost:3001"
echo "API documentation: http://localhost:3001/api/menus"
