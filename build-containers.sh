#!/bin/bash

# SoCTeamUp Container Build Script
echo "🐳 Building SoCTeamUp Containers..."

# Build Frontend Container
echo "📱 Building Frontend Container..."
docker build -f Dockerfile.frontend -t socteamup-frontend .

# Build Backend Container
echo "🔧 Building Backend Container..."
docker build -f Dockerfile.backend -t socteamup-backend .

echo "✅ Containers built successfully!"
echo ""
echo "🚀 To run containers:"
echo "   Frontend: docker run -p 3000:3000 socteamup-frontend"
echo "   Backend:  docker run -p 3001:3001 socteamup-backend"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001" 