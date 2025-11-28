#!/usr/bin/env powershell

# SocTeamUp Docker Hub Build and Push Script
# This script builds the frontend and backend images and pushes them to Docker Hub

param(
    [Parameter(Mandatory=$true)]
    [string]$DockerHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$Tag = "latest"
)

Write-Host "🚀 SocTeamUp Docker Hub Build and Push Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if Docker is available
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not available. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Login to Docker Hub
Write-Host "`n🔐 Logging into Docker Hub..." -ForegroundColor Yellow
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to login to Docker Hub" -ForegroundColor Red
    exit 1
}

# Build Frontend Image
Write-Host "`n🏗️ Building Frontend Image..." -ForegroundColor Yellow
$frontendImage = "${DockerHubUsername}/socteamup-frontend:${Tag}"
docker build -f Dockerfile.frontend -t $frontendImage .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build frontend image" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend image built: $frontendImage" -ForegroundColor Green

# Build Backend Image
Write-Host "`n🏗️ Building Backend Image..." -ForegroundColor Yellow
$backendImage = "${DockerHubUsername}/socteamup-backend:${Tag}"
docker build -f Dockerfile.backend -t $backendImage .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build backend image" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend image built: $backendImage" -ForegroundColor Green

# Push Frontend Image
Write-Host "`n📤 Pushing Frontend Image to Docker Hub..." -ForegroundColor Yellow
docker push $frontendImage
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push frontend image" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend image pushed: $frontendImage" -ForegroundColor Green

# Push Backend Image
Write-Host "`n📤 Pushing Backend Image to Docker Hub..." -ForegroundColor Yellow
docker push $backendImage
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push backend image" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend image pushed: $backendImage" -ForegroundColor Green

# Update docker-compose.yml with new image names
Write-Host "`n📝 Creating docker-compose-hub.yml with Docker Hub images..." -ForegroundColor Yellow

$dockerComposeHubContent = @"
services:
  # Frontend Service (Next.js) - Using Docker Hub Image
  frontend:
    image: ${frontendImage}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend
    networks:
      - socteamup-network
    restart: unless-stopped

  # Backend Service (Lambda functions wrapped in Express) - Using Docker Hub Image
  backend:
    image: ${backendImage}
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      # Database configuration
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=socteamup_db
      - DB_USER=socteamup_user
      - DB_PASSWORD=socteamup_password
      # Add your environment variables here
      - JWT_SECRET=your-jwt-secret-key
      - GOOGLE_CLIENT_ID=your-google-client-id
      - GOOGLE_CLIENT_SECRET=your-google-client-secret
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=your-aws-access-key
      - AWS_SECRET_ACCESS_KEY=your-aws-secret-key
    depends_on:
      - mysql
    networks:
      - socteamup-network
    restart: unless-stopped

  # MySQL Database Service
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=socteamup_db
      - MYSQL_USER=socteamup_user
      - MYSQL_PASSWORD=socteamup_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - socteamup-network
    restart: unless-stopped

  # Nginx Reverse Proxy (Optional - for production)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - socteamup-network
    restart: unless-stopped
    profiles:
      - production

networks:
  socteamup-network:
    driver: bridge

volumes:
  mysql_data:
    driver: local
  node_modules: 
"@

$dockerComposeHubContent | Out-File -FilePath "docker-compose-hub.yml" -Encoding UTF8

Write-Host "✅ Created docker-compose-hub.yml for using Docker Hub images" -ForegroundColor Green

Write-Host "`n🎉 SUCCESS! Your images are now on Docker Hub:" -ForegroundColor Green
Write-Host "   Frontend: $frontendImage" -ForegroundColor Cyan
Write-Host "   Backend:  $backendImage" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. To run from Docker Hub: docker-compose -f docker-compose-hub.yml up" -ForegroundColor White
Write-Host "   2. Share your Docker Hub repository with others" -ForegroundColor White
Write-Host "   3. Others can pull and run: docker-compose -f docker-compose-hub.yml up" -ForegroundColor White

Write-Host "`n🔗 Your Docker Hub repositories:" -ForegroundColor Yellow
Write-Host "   https://hub.docker.com/r/${DockerHubUsername}/socteamup-frontend" -ForegroundColor Cyan
Write-Host "   https://hub.docker.com/r/${DockerHubUsername}/socteamup-backend" -ForegroundColor Cyan 