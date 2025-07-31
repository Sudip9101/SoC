# SoCTeamUp Container Run Script (PowerShell)
Write-Host "🚀 Starting SoCTeamUp Containers..." -ForegroundColor Green

# Check if containers exist
$frontendImage = docker images -q socteamup-frontend 2>$null
$backendImage = docker images -q socteamup-backend 2>$null

if (-not $frontendImage) {
    Write-Host "❌ Frontend container not found. Run build-containers.ps1 first." -ForegroundColor Red
    exit 1
}

if (-not $backendImage) {
    Write-Host "❌ Backend container not found. Run build-containers.ps1 first." -ForegroundColor Red
    exit 1
}

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker stop socteamup-frontend socteamup-backend 2>$null
docker rm socteamup-frontend socteamup-backend 2>$null

# Start Backend Container
Write-Host "🔧 Starting Backend Container..." -ForegroundColor Yellow
docker run -d `
    --name socteamup-backend `
    -p 3001:3001 `
    -e NODE_ENV=production `
    -e JWT_SECRET=your-jwt-secret `
    -e GOOGLE_CLIENT_ID=your-google-client-id `
    -e GOOGLE_CLIENT_SECRET=your-google-client-secret `
    -e AWS_REGION=us-east-1 `
    -e AWS_ACCESS_KEY_ID=your-aws-access-key `
    -e AWS_SECRET_ACCESS_KEY=your-aws-secret-key `
    socteamup-backend

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend Container
Write-Host "📱 Starting Frontend Container..." -ForegroundColor Yellow
docker run -d `
    --name socteamup-frontend `
    -p 3000:3000 `
    -e NODE_ENV=production `
    -e NEXT_PUBLIC_API_URL=http://localhost:3001 `
    socteamup-frontend

Write-Host "✅ Containers started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "   Health:   http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "📊 Container status:" -ForegroundColor Cyan
docker ps --filter "name=socteamup"
Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker logs socteamup-frontend" -ForegroundColor White
Write-Host "   View logs: docker logs socteamup-backend" -ForegroundColor White
Write-Host "   Stop all:  docker stop socteamup-frontend socteamup-backend" -ForegroundColor White 