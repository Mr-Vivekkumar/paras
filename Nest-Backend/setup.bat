@echo off
echo 🚀 Setting up Menu Management Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy env.example .env
    echo ✅ .env file created. Please update it with your database credentials.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Update .env file with your database credentials
echo 2. Create PostgreSQL database: createdb menu_management
echo 3. Start the application: npm run start:dev
echo.
echo The backend will be available at: http://localhost:3001
echo API documentation: http://localhost:3001/api/menus
echo.
pause
