#!/bin/bash

# ExpenseTracker Integration Test Script
# Script untuk testing integrasi Frontend React dengan Backend Spring Boot

echo "🚀 ExpenseTracker Integration Test"
echo "=================================="

# Check if backend is running
echo "📡 Checking backend connection..."
if curl -s http://localhost:8080/api/auth/login > /dev/null; then
    echo "✅ Backend is running on http://localhost:8080"
else
    echo "❌ Backend is not running. Please start Spring Boot application first."
    echo "   Run: mvn spring-boot:run in your backend directory"
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if React app is already running
if lsof -i :3000 > /dev/null; then
    echo "⚠️  React app is already running on port 3000"
else
    echo "🏃 Starting React development server..."
    npm start &
    REACT_PID=$!
    
    # Wait for React to start
    echo "⏳ Waiting for React to start..."
    sleep 10
    
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend is running on http://localhost:3000"
    else
        echo "❌ Failed to start frontend"
        exit 1
    fi
fi

echo ""
echo "🎉 Integration Test Complete!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo ""
echo "📋 Test the following features:"
echo "1. Register new user"
echo "2. Login with credentials"
echo "3. Add new expense"
echo "4. View expenses in dashboard"
echo "5. Edit expense"
echo "6. Delete expense"
echo "7. Logout"
echo ""
echo "Press Ctrl+C to stop the application"

# Keep script running
wait
