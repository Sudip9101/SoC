# SoCTeamUp Local Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SoCTeamUp Local Development Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
$nodeVersion = $null
try {
    $nodeVersion = node --version 2>$null
} catch {
    $nodeVersion = $null
}

if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js 18+ from one of these options:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://nodejs.org/" -ForegroundColor White
    Write-Host "  2. Or use Chocolatey: choco install nodejs-lts" -ForegroundColor White
    Write-Host "  3. Or use Scoop: scoop install nodejs-lts" -ForegroundColor White
    Write-Host ""
    Write-Host "After installing Node.js, please:" -ForegroundColor Yellow
    Write-Host "  1. Close and reopen your terminal" -ForegroundColor White
    Write-Host "  2. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Check for npm
Write-Host "Checking for npm..." -ForegroundColor Yellow
$npmVersion = $null
try {
    $npmVersion = npm --version 2>$null
} catch {
    $npmVersion = $null
}

if (-not $npmVersion) {
    Write-Host "❌ npm is not available!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
    Write-Host ""
}

# Start the development server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

