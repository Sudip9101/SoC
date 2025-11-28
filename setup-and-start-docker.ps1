# SoC TeamUp Docker Setup and Startup Script
# This script helps install Docker and start the project containers

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   SoC TeamUp Docker Setup & Startup    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check if Docker is installed
Write-Host "1. Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "   ✓ Docker is installed: $dockerVersion" -ForegroundColor Green
        $dockerInstalled = $true
    } else {
        throw "Docker not found"
    }
} catch {
    Write-Host "   ✗ Docker is NOT installed" -ForegroundColor Red
    $dockerInstalled = $false
}

if (!$dockerInstalled) {
    Write-Host ""
    Write-Host "Docker Installation Required:" -ForegroundColor Yellow
    Write-Host "1. Go to https://www.docker.com/products/docker-desktop/" -ForegroundColor White
    Write-Host "2. Download Docker Desktop for Windows" -ForegroundColor White
    Write-Host "3. Install Docker Desktop" -ForegroundColor White
    Write-Host "4. Start Docker Desktop" -ForegroundColor White
    Write-Host "5. Restart PowerShell and run this script again" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Would you like me to open the Docker download page? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Start-Process "https://www.docker.com/products/docker-desktop/"
    }
    
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker Desktop is running
Write-Host ""
Write-Host "2. Checking Docker service..." -ForegroundColor Yellow
try {
    docker info 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Docker service is running" -ForegroundColor Green
    } else {
        throw "Docker service not running"
    }
} catch {
    Write-Host "   ✗ Docker service is not running" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "3. Building Docker containers..." -ForegroundColor Yellow

# Build Frontend Container
Write-Host "   📱 Building Frontend Container..." -ForegroundColor Cyan
docker build -f Dockerfile.frontend -t socteamup-frontend .
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Failed to build frontend container" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "   ✓ Frontend container built successfully" -ForegroundColor Green

# Build Backend Container
Write-Host "   🔧 Building Backend Container..." -ForegroundColor Cyan
docker build -f Dockerfile.backend -t socteamup-backend .
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Failed to build backend container" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "   ✓ Backend container built successfully" -ForegroundColor Green

Write-Host ""
Write-Host "4. Starting containers..." -ForegroundColor Yellow

# Stop any existing containers
Write-Host "   🛑 Stopping existing containers..." -ForegroundColor Cyan
docker stop soc-mysql soc-backend soc-frontend 2>$null
docker rm soc-mysql soc-backend soc-frontend 2>$null

# Create a network for containers
Write-Host "   🌐 Creating Docker network..." -ForegroundColor Cyan
docker network create socteamup-network 2>$null

# Start MySQL
Write-Host "   🗄️ Starting MySQL container..." -ForegroundColor Cyan
docker run -d --name soc-mysql --network socteamup-network -p 3306:3306 `
    -e MYSQL_ROOT_PASSWORD=root_password `
    -e MYSQL_DATABASE=socteamup_db `
    -e MYSQL_USER=socteamup_user `
    -e MYSQL_PASSWORD=socteamup_password `
    mysql:8.0

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Failed to start MySQL container" -ForegroundColor Red
    exit 1
}

# Wait for MySQL to start
Write-Host "   ⏳ Waiting for MySQL to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 15

# Start Backend
Write-Host "   ⚙️ Starting Backend container..." -ForegroundColor Cyan
docker run -d --name soc-backend --network socteamup-network -p 3001:3001 `
    -e NODE_ENV=production `
    -e JWT_SECRET=dev-jwt-secret-key `
    -e PORT=3001 `
    socteamup-backend

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Failed to start backend container" -ForegroundColor Red
    exit 1
}

# Wait for backend to start
Write-Host "   ⏳ Waiting for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "   🎨 Starting Frontend container..." -ForegroundColor Cyan
docker run -d --name soc-frontend --network socteamup-network -p 3000:3000 `
    -e NODE_ENV=production `
    -e NEXT_PUBLIC_API_URL=http://localhost:3001 `
    socteamup-frontend

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Failed to start frontend container" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All containers started successfully!" -ForegroundColor Green
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
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host ""
Write-Host "🚀 Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "💡 Useful Commands:" -ForegroundColor Cyan
Write-Host "   View logs: docker logs soc-frontend" -ForegroundColor White
Write-Host "   Stop all:  docker stop soc-frontend soc-backend soc-mysql" -ForegroundColor White
Write-Host "   Restart:   docker restart soc-frontend soc-backend soc-mysql" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
