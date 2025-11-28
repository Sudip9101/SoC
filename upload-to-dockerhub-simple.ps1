# Simple Docker Hub Upload Script for SocTeamUp
# Run this after Docker Desktop is installed and running

Write-Host "🚀 SocTeamUp Docker Hub Upload Helper" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Get Docker Hub username from user
$username = Read-Host "Enter your Docker Hub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Docker Hub username is required!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Here are the commands to run:" -ForegroundColor Yellow
Write-Host "Copy and paste these commands one by one:`n" -ForegroundColor White

Write-Host "1. Login to Docker Hub:" -ForegroundColor Green
Write-Host "   docker login" -ForegroundColor Cyan

Write-Host "`n2. Build Frontend Image:" -ForegroundColor Green
Write-Host "   docker build -f Dockerfile.frontend -t $username/socteamup-frontend:latest ." -ForegroundColor Cyan

Write-Host "`n3. Build Backend Image:" -ForegroundColor Green
Write-Host "   docker build -f Dockerfile.backend -t $username/socteamup-backend:latest ." -ForegroundColor Cyan

Write-Host "`n4. Push Frontend Image:" -ForegroundColor Green
Write-Host "   docker push $username/socteamup-frontend:latest" -ForegroundColor Cyan

Write-Host "`n5. Push Backend Image:" -ForegroundColor Green
Write-Host "   docker push $username/socteamup-backend:latest" -ForegroundColor Cyan

Write-Host "`n📝 After uploading, your images will be available at:" -ForegroundColor Yellow
Write-Host "   https://hub.docker.com/r/$username/socteamup-frontend" -ForegroundColor Cyan
Write-Host "   https://hub.docker.com/r/$username/socteamup-backend" -ForegroundColor Cyan

Write-Host "`n⚠️  Make sure Docker Desktop is running before executing these commands!" -ForegroundColor Red

# Create docker-compose file with the user's images
$dockerComposeContent = @"
services:
  # Frontend Service (Next.js) - Using Docker Hub Image
  frontend:
    image: $username/socteamup-frontend:latest
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
    image: $username/socteamup-backend:latest
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
"@

$dockerComposeContent | Out-File -FilePath "docker-compose-dockerhub.yml" -Encoding UTF8

Write-Host "`n✅ Created docker-compose-dockerhub.yml with your Docker Hub images!" -ForegroundColor Green
Write-Host "`nTo use your uploaded images later, run:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose-dockerhub.yml up" -ForegroundColor Cyan 