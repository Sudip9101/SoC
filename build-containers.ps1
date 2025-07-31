# SoCTeamUp Container Build Script (PowerShell)
Write-Host "🐳 Building SoCTeamUp Containers..." -ForegroundColor Green

# Build Frontend Container
Write-Host "📱 Building Frontend Container..." -ForegroundColor Yellow
docker build -f Dockerfile.frontend -t socteamup-frontend .

# Build Backend Container
Write-Host "🔧 Building Backend Container..." -ForegroundColor Yellow
docker build -f Dockerfile.backend -t socteamup-backend .

Write-Host "✅ Containers built successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To run containers:" -ForegroundColor Cyan
Write-Host "   Frontend: docker run -p 3000:3000 socteamup-frontend" -ForegroundColor White
Write-Host "   Backend:  docker run -p 3001:3001 socteamup-backend" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White 