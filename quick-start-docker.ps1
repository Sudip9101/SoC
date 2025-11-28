# Quick Docker Compose Startup Script
# This is a simpler alternative using docker-compose

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SoC TeamUp Quick Docker Startup    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "✓ Docker is installed: $dockerVersion" -ForegroundColor Green
    } else {
        throw "Docker not found"
    }
} catch {
    Write-Host "✗ Docker is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Docker Desktop first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://www.docker.com/products/docker-desktop/" -ForegroundColor White
    Write-Host "2. Download and install Docker Desktop" -ForegroundColor White
    Write-Host "3. Start Docker Desktop" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker is running
Write-Host ""
Write-Host "Checking Docker service..." -ForegroundColor Yellow
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Docker service is running" -ForegroundColor Green
    } else {
        throw "Docker service not running"
    }
} catch {
    Write-Host "✗ Docker service is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting services with Docker Compose..." -ForegroundColor Yellow

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Cyan
docker-compose down 2>$null

# Build and start services
Write-Host "Building and starting services..." -ForegroundColor Cyan
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access Points:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:3001" -ForegroundColor White
    Write-Host "   MySQL:     localhost:3306" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Test Login Credentials:" -ForegroundColor Cyan
    Write-Host "   Regular User:" -ForegroundColor White
    Write-Host "   Email: test@example.com" -ForegroundColor Green
    Write-Host "   Password: password123" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Admin User:" -ForegroundColor White
    Write-Host "   Email: admin@socteamup.com" -ForegroundColor Green
    Write-Host "   Password: admin123" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Container Status:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "🚀 Opening browser..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000"
    Write-Host ""
    Write-Host "💡 Useful Commands:" -ForegroundColor Cyan
    Write-Host "   View logs: docker-compose logs" -ForegroundColor White
    Write-Host "   Stop all:  docker-compose down" -ForegroundColor White
    Write-Host "   Restart:   docker-compose restart" -ForegroundColor White
} else {
    Write-Host "✗ Failed to start services" -ForegroundColor Red
    Write-Host "Check the error messages above" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
