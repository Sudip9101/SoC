# SoCTeamup Docker Hub Upload Script
param(
    [string]$DockerHubUsername = "sudipd",
    [string]$Version = "latest"
)

Write-Host "SoCTeamup Docker Hub Upload Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Gray
Write-Host ""

# Set paths
$env:PATH += ";C:\Program Files\Docker\Docker\resources\bin"

# Define images
$BackendImage = "$DockerHubUsername/socteamup-backend"
$FrontendImage = "$DockerHubUsername/socteamup-frontend"

Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Docker Hub Username: $DockerHubUsername" -ForegroundColor White
Write-Host "  Version Tag: $Version" -ForegroundColor White
Write-Host ""

# Check Docker status
Write-Host "Checking Docker status..." -ForegroundColor Yellow
$dockerCheck = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running" -ForegroundColor Red
    exit 1
}
Write-Host "Docker is running" -ForegroundColor Green
Write-Host ""

# Login check
Write-Host "Checking Docker Hub login..." -ForegroundColor Yellow
$loginInfo = docker info 2>$null | Select-String "Username"
if (-not $loginInfo) {
    Write-Host "Please login to Docker Hub first:" -ForegroundColor Yellow
    Write-Host "  docker login" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Login now? (y/n)"
    if ($response -eq "y") {
        docker login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Login failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Login required to continue" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Logged into Docker Hub" -ForegroundColor Green
Write-Host ""

# Build and push backend
Write-Host "Building Backend Image..." -ForegroundColor Yellow
Write-Host "  Image: $BackendImage:$Version" -ForegroundColor White

docker build -f Dockerfile.backend-production -t "$BackendImage:$Version" -t "$BackendImage:latest" .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend build successful" -ForegroundColor Green
    
    Write-Host "Pushing backend to Docker Hub..." -ForegroundColor Yellow
    docker push "$BackendImage:$Version"
    docker push "$BackendImage:latest"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backend uploaded successfully" -ForegroundColor Green
    } else {
        Write-Host "Backend upload failed" -ForegroundColor Red
    }
} else {
    Write-Host "Backend build failed" -ForegroundColor Red
}

Write-Host ""

# Build and push frontend
Write-Host "Building Frontend Image..." -ForegroundColor Yellow
Write-Host "  Image: $FrontendImage:$Version" -ForegroundColor White

docker build -f Dockerfile.frontend-production -t "$FrontendImage:$Version" -t "$FrontendImage:latest" .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend build successful" -ForegroundColor Green
    
    Write-Host "Pushing frontend to Docker Hub..." -ForegroundColor Yellow
    docker push "$FrontendImage:$Version"
    docker push "$FrontendImage:latest"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Frontend uploaded successfully" -ForegroundColor Green
    } else {
        Write-Host "Frontend upload failed" -ForegroundColor Red
    }
} else {
    Write-Host "Frontend build failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Upload process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Your images are now available:" -ForegroundColor Cyan
Write-Host "  $BackendImage:latest" -ForegroundColor White
Write-Host "  $FrontendImage:latest" -ForegroundColor White
Write-Host ""
Write-Host "To deploy, use:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose-dockerhub.yml up -d" -ForegroundColor White 