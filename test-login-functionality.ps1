# SoC TeamUp Login/Registration Test Script
# This script helps test the login and registration functionality

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   SoC TeamUp Login/Registration Test   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "1. Checking if Node.js is installed..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   ✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "   ✗ Node.js is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download and install Node.js 18 or higher" -ForegroundColor White
    Write-Host "3. Restart PowerShell and run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if dependencies are installed
Write-Host "2. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ Dependencies are installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Start the development server
Write-Host "3. Starting the development server..." -ForegroundColor Yellow
Write-Host "   The server will start on http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Demo Login Credentials:" -ForegroundColor Cyan
Write-Host "   Regular User:" -ForegroundColor White
Write-Host "   Email: test@example.com" -ForegroundColor Green
Write-Host "   Password: password123" -ForegroundColor Green
Write-Host ""
Write-Host "   Admin User:" -ForegroundColor White
Write-Host "   Email: admin@socteamup.com" -ForegroundColor Green
Write-Host "   Password: admin123" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server when done testing" -ForegroundColor Yellow
Write-Host ""

# Start the development server
Start-Process -FilePath "cmd" -ArgumentList "/c start http://localhost:3000" -WindowStyle Hidden
npm run dev
