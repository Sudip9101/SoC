# Simple container startup script
Write-Host "Starting SoC TeamUp containers..." -ForegroundColor Green

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker stop soc-mysql soc-backend soc-frontend 2>$null
docker rm soc-mysql soc-backend soc-frontend 2>$null

# Start MySQL
Write-Host "Starting MySQL container..." -ForegroundColor Yellow
docker run -d --name soc-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root_password -e MYSQL_DATABASE=socteamup_db -e MYSQL_USER=socteamup_user -e MYSQL_PASSWORD=socteamup_password mysql:8.0

# Wait for MySQL to start
Write-Host "Waiting for MySQL to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Backend (if image exists)
Write-Host "Starting Backend container..." -ForegroundColor Yellow
docker run -d --name soc-backend -p 3001:3001 -e NODE_ENV=production -e JWT_SECRET=your-jwt-secret -e GOOGLE_CLIENT_ID=your-google-client-id -e GOOGLE_CLIENT_SECRET=your-google-client-secret -e AWS_REGION=us-east-1 -e AWS_ACCESS_KEY_ID=your-aws-access-key -e AWS_SECRET_ACCESS_KEY=your-aws-secret-key socteamup-backend

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend (if image exists)
Write-Host "Starting Frontend container..." -ForegroundColor Yellow
docker run -d --name soc-frontend -p 3000:3000 -e NODE_ENV=production -e NEXT_PUBLIC_API_URL=http://localhost:3001 socteamup-frontend

Write-Host "Containers started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "MySQL: localhost:3306" -ForegroundColor Cyan

docker ps 