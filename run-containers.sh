#!/bin/bash

# SoCTeamUp Container Run Script
echo "🚀 Starting SoCTeamUp Containers..."

# Check if containers exist
if [[ "$(docker images -q socteamup-frontend 2> /dev/null)" == "" ]]; then
    echo "❌ Frontend container not found. Run build-containers.sh first."
    exit 1
fi

if [[ "$(docker images -q socteamup-backend 2> /dev/null)" == "" ]]; then
    echo "❌ Backend container not found. Run build-containers.sh first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker stop socteamup-frontend socteamup-backend 2>/dev/null || true
docker rm socteamup-frontend socteamup-backend 2>/dev/null || true

# Start Backend Container
echo "🔧 Starting Backend Container..."
docker run -d \
    --name socteamup-backend \
    -p 3001:3001 \
    -e NODE_ENV=production \
    -e JWT_SECRET=your-jwt-secret \
    -e GOOGLE_CLIENT_ID=your-google-client-id \
    -e GOOGLE_CLIENT_SECRET=your-google-client-secret \
    -e AWS_REGION=us-east-1 \
    -e AWS_ACCESS_KEY_ID=your-aws-access-key \
    -e AWS_SECRET_ACCESS_KEY=your-aws-secret-key \
    socteamup-backend

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start Frontend Container
echo "📱 Starting Frontend Container..."
docker run -d \
    --name socteamup-frontend \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
    socteamup-frontend

echo "✅ Containers started successfully!"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
echo ""
echo "📊 Container status:"
docker ps --filter "name=socteamup"
echo ""
echo "📝 Useful commands:"
echo "   View logs: docker logs socteamup-frontend"
echo "   View logs: docker logs socteamup-backend"
echo "   Stop all:  docker stop socteamup-frontend socteamup-backend" 