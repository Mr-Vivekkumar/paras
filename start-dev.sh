#!/bin/bash

echo "Starting Menu Management System..."
echo

echo "Starting Backend API Server..."
cd Backend && npm run dev &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Application..."
cd ../Frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "Both services are starting..."
echo "Backend API: http://localhost:3001"
echo "Frontend App: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait
