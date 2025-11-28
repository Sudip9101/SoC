# Push SoCTeamUp Images to Docker Hub
# Docker Hub Username: rackssudip

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Push Images to Docker Hub" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Docker Hub Username: rackssudip" -ForegroundColor Yellow
Write-Host ""

# Step 1: Login to Docker Hub
Write-Host "Step 1: Logging in to Docker Hub..." -ForegroundColor Yellow
docker login -u rackssudip

if ($LASTEXITCODE -ne 0) {
    Write-Host "Login failed! Please check your credentials." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Push Backend Images
Write-Host "Step 2: Pushing Backend Images..." -ForegroundColor Yellow
Write-Host "  Pushing rackssudip/socteamup-backend:latest..." -ForegroundColor Cyan
docker push rackssudip/socteamup-backend:latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Backend latest pushed!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend latest push failed!" -ForegroundColor Red
}

Write-Host "  Pushing rackssudip/socteamup-backend:v1.0..." -ForegroundColor Cyan
docker push rackssudip/socteamup-backend:v1.0

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Backend v1.0 pushed!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Backend v1.0 push failed!" -ForegroundColor Red
}

Write-Host ""

# Step 3: Push Frontend Images
Write-Host "Step 3: Pushing Frontend Images (this may take a while)..." -ForegroundColor Yellow
Write-Host "  Pushing rackssudip/socteamup-frontend:latest..." -ForegroundColor Cyan
docker push rackssudip/socteamup-frontend:latest

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Frontend latest pushed!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend latest push failed!" -ForegroundColor Red
}

Write-Host "  Pushing rackssudip/socteamup-frontend:v1.0..." -ForegroundColor Cyan
docker push rackssudip/socteamup-frontend:v1.0

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Frontend v1.0 pushed!" -ForegroundColor Green
} else {
    Write-Host "  ❌ Frontend v1.0 push failed!" -ForegroundColor Red
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Push Complete!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Images available at:" -ForegroundColor Yellow
Write-Host "  🐳 https://hub.docker.com/r/rackssudip/socteamup-backend" -ForegroundColor Cyan
Write-Host "  🐳 https://hub.docker.com/r/rackssudip/socteamup-frontend" -ForegroundColor Cyan
Write-Host ""

Write-Host "To pull these images:" -ForegroundColor Yellow
Write-Host "  docker pull rackssudip/socteamup-backend:v1.0" -ForegroundColor White
Write-Host "  docker pull rackssudip/socteamup-frontend:v1.0" -ForegroundColor White
Write-Host ""




