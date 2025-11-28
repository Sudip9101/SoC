# Start SoCTeamUp Development Server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting SoCTeamUp Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set up Node.js path
$nodePath = "$env:TEMP\nodejs-portable\node-v20.18.0-win-x64"
if (Test-Path "$nodePath\node.exe") {
    $env:Path = "$nodePath;$env:Path"
    Write-Host "✅ Node.js configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  Using system Node.js" -ForegroundColor Yellow
}

# Show versions
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "Node.js: $nodeVersion | npm: $npmVersion" -ForegroundColor Cyan
Write-Host ""

# Start server
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  🌐 http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev

