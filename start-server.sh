#!/bin/bash

# Bland Demo - Local Server Startup Script

echo "🚀 Starting Bland Demo Local Server"
echo "=================================="

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found - using Python server"
    python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python found - using Python server"
    python server.py
elif command -v node &> /dev/null; then
    echo "✅ Node.js found - using http-server"
    npx http-server -p 3000 -o
else
    echo "❌ Neither Python nor Node.js found"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Or run manually:"
    echo "  python3 server.py"
    echo "  npx http-server -p 3000 -o"
    exit 1
fi
