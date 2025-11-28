# SoCTeamUp Local Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting SoCTeamUp Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set up Node.js from portable installation
$nodePath = "$env:TEMP\nodejs-portable\node-v20.18.0-win-x64"
if (Test-Path "$nodePath\node.exe") {
    $env:Path = "$nodePath;$env:Path"
    Write-Host "✅ Using portable Node.js installation" -ForegroundColor Green
} else {
    # Try to find Node.js in system PATH
    $nodeExe = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeExe) {
        Write-Host "✅ Using system Node.js installation" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js not found!" -ForegroundColor Red
        Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
}

# Check Node.js version
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "Node.js: $nodeVersion" -ForegroundColor Cyan
Write-Host "npm: $npmVersion" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    Write-Host ""
}

# Start the development server
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "  🌐 http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

