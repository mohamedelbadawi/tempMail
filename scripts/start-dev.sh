#!/bin/bash

echo "Starting TempMail Development Environment..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    
    # Try different methods to start MongoDB
    if command -v brew &> /dev/null; then
        # macOS with Homebrew
        brew services start mongodb-community
    elif command -v systemctl &> /dev/null; then
        # Linux with systemd
        sudo systemctl start mongod
    else
        echo "Warning: Could not start MongoDB automatically."
        echo "Please start MongoDB manually."
    fi
else
    echo "MongoDB is already running"
fi

echo ""
echo "Starting development servers..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo "SMTP Server: port 2525"
echo ""

# Start servers in background
npm run server &
SERVER_PID=$!

sleep 3

cd client && npm run dev &
CLIENT_PID=$!

echo ""
echo "Development servers started!"
echo "Backend PID: $SERVER_PID"
echo "Frontend PID: $CLIENT_PID"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $SERVER_PID $CLIENT_PID; exit" INT
wait
