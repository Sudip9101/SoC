#!/usr/bin/env pwsh

# =============================================================================
# SoCTeamup Docker Hub Upload Script
# =============================================================================

param(
    [string]$DockerHubUsername = "sudipd",
    [string]$Version = "latest"
)

Write-Host "SoCTeamup Docker Hub Upload Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Gray
Write-Host ""

# Set paths
$env:PATH += ";C:\Program Files\Docker\Docker\resources\bin"
$env:PATH += ";C:\Program Files\nodejs"

# Define image names
$IMAGES = @{
    "frontend" = @{
        "dockerfile" = "Dockerfile.frontend-production"
        "name" = "$DockerHubUsername/socteamup-frontend"
        "context" = "."
    }
    "backend" = @{
        "dockerfile" = "Dockerfile.backend-production" 
        "name" = "$DockerHubUsername/socteamup-backend"
        "context" = "."
    }
}

Write-Host "📋 Configuration:" -ForegroundColor Cyan
Write-Host "   Docker Hub Username: $DockerHubUsername" -ForegroundColor White
Write-Host "   Version Tag: $Version" -ForegroundColor White
Write-Host "   Images to build: frontend, backend" -ForegroundColor White
Write-Host ""

# Function to build and push image
function Build-And-Push-Image {
    param($ImageType, $Config)
    
    $imageName = $Config.name
    $dockerfile = $Config.dockerfile
    $context = $Config.context
    
         Write-Host "🔨 Building $ImageType image..." -ForegroundColor Yellow
     Write-Host "   Image: ${imageName}:${Version}" -ForegroundColor White
     Write-Host "   Dockerfile: $dockerfile" -ForegroundColor White
    
         # Build the image
     $versionTag = "${imageName}:${Version}"
     $latestTag = "${imageName}:latest"
     $buildResult = docker build -f $dockerfile -t $versionTag -t $latestTag $context
     
     if ($LASTEXITCODE -eq 0) {
         Write-Host "✅ Build successful for $ImageType" -ForegroundColor Green
         
         Write-Host "📤 Pushing $ImageType to Docker Hub..." -ForegroundColor Yellow
         
         # Push versioned tag
         docker push $versionTag
         if ($LASTEXITCODE -eq 0) {
             Write-Host "✅ Pushed $versionTag" -ForegroundColor Green
         } else {
             Write-Host "❌ Failed to push $versionTag" -ForegroundColor Red
             return $false
         }
         
         # Push latest tag
         docker push $latestTag
         if ($LASTEXITCODE -eq 0) {
             Write-Host "✅ Pushed $latestTag" -ForegroundColor Green
         } else {
             Write-Host "❌ Failed to push $latestTag" -ForegroundColor Red
             return $false
         }
        
        return $true
    } else {
        Write-Host "❌ Build failed for $ImageType" -ForegroundColor Red
        return $false
    }
}

# Check if Docker is running
Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow
$dockerStatus = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running or not accessible" -ForegroundColor Red
    Write-Host "💡 Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green

# Check if logged into Docker Hub
Write-Host "🔍 Checking Docker Hub login..." -ForegroundColor Yellow
$loginCheck = docker info 2>$null | Select-String "Username"
if (-not $loginCheck) {
    Write-Host "⚠️  Not logged into Docker Hub" -ForegroundColor Yellow
    Write-Host "🔑 Please login to Docker Hub:" -ForegroundColor Cyan
    Write-Host "   docker login" -ForegroundColor White
    Write-Host ""
    
    $response = Read-Host "Do you want to login now? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        docker login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Docker Hub login failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Docker Hub login required" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Logged into Docker Hub" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting build and upload process..." -ForegroundColor Green
Write-Host ""

$successCount = 0
$totalImages = $IMAGES.Count

# Build and push each image
foreach ($imageType in $IMAGES.Keys) {
    $config = $IMAGES[$imageType]
    
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host "Building and uploading: $imageType" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    $success = Build-And-Push-Image -ImageType $imageType -Config $config
    
    if ($success) {
        $successCount++
        Write-Host "✅ $imageType completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ $imageType failed" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Summary
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "📊 UPLOAD SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "Success: $successCount/$totalImages images" -ForegroundColor White

if ($successCount -eq $totalImages) {
    Write-Host "🎉 ALL IMAGES UPLOADED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your Docker images are now available:" -ForegroundColor Cyan
    foreach ($imageType in $IMAGES.Keys) {
        $imageName = $IMAGES[$imageType].name
                 Write-Host "   📦 ${imageName}:latest" -ForegroundColor White
         Write-Host "   📦 ${imageName}:${Version}" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "🐳 To pull and run:" -ForegroundColor Yellow
    Write-Host "   docker pull $($IMAGES.backend.name):latest" -ForegroundColor White
    Write-Host "   docker pull $($IMAGES.frontend.name):latest" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Use docker-compose-dockerhub.yml for deployment" -ForegroundColor Yellow
} else {
    Write-Host "Some images failed to upload" -ForegroundColor Yellow
    Write-Host "Check the errors above and retry" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🏁 Script completed" -ForegroundColor Green 