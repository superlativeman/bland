#!/bin/bash

# Bland Demo - Local Server Startup Script

echo "🚀 Starting Bland Demo Local Server"
echo "=================================="

# Check if Node.js is available (preferred for API proxy support)
if command -v node &> /dev/null; then
    echo "✅ Node.js found - using Node.js server with API proxy"
    node server.js
# Check if Python 3 is available
elif command -v python3 &> /dev/null; then
    echo "✅ Python 3 found - using Python server with API proxy"
    python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python found - using Python server with API proxy"
    python server.py
else
    echo "❌ Neither Node.js nor Python found"
    echo ""
    echo "Please install one of the following:"
    echo "  - Node.js: https://nodejs.org/ (recommended)"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo ""
    echo "Or run manually:"
    echo "  node server.js"
    echo "  python3 server.py"
    exit 1
fi
