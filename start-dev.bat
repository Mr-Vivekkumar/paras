@echo off
echo Starting Menu Management System...
echo.

echo Starting Backend API Server...
start "Backend API" cmd /k "cd Backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Application...
start "Frontend App" cmd /k "cd Frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend API: http://localhost:3001
echo Frontend App: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
