@echo off
echo ==========================================
echo    SoCTeamup Production Docker Setup
echo ==========================================
echo.

echo Adding Docker and Node.js to PATH...
set PATH=%PATH%;C:\Program Files\Docker\Docker\resources\bin
set PATH=%PATH%;C:\Program Files\nodejs

echo.
echo Stopping any existing containers...
docker stop socteamup-mysql-prod socteamup-backend-prod socteamup-frontend-prod 2>nul
docker rm socteamup-mysql-prod socteamup-backend-prod socteamup-frontend-prod 2>nul

echo.
echo Building and starting production containers...
docker compose -f docker-compose-production.yml down
docker compose -f docker-compose-production.yml up --build -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS! Production containers are running.
    echo.
    echo 🌐 Access Points:
    echo    Frontend:     http://localhost:3000
    echo    Backend API:  http://localhost:3001
    echo    MySQL DB:     localhost:3306
    echo    Admin Panel:  http://localhost:3000/admin/auth-logs
    echo.
    echo 🔐 Test Authentication:
    echo    Registration: http://localhost:3000/login
    echo    Backend API:  http://localhost:3001/health
    echo.
    echo 📊 Container Status:
    docker compose -f docker-compose-production.yml ps
    echo.
    echo 🧪 Testing connections...
    timeout /t 5 >nul
    
    echo Testing MySQL connection...
    docker exec socteamup-mysql-prod mysql -u socteamup_user -psocteamup_password socteamup_db -e "SHOW TABLES;" 2>nul
    
    echo Testing Backend API...
    curl -s http://localhost:3001/health
    echo.
    
    echo Opening browser in 5 seconds...
    timeout /t 5 >nul
    start http://localhost:3000
    echo.
    echo 💡 Production Features:
    echo    ✅ MySQL Database with persistent storage
    echo    ✅ Backend API with authentication endpoints
    echo    ✅ Frontend connecting to backend on port 3001
    echo    ✅ Secure password hashing with bcrypt
    echo    ✅ Authentication logging and admin dashboard
    echo    ✅ Contact form with database storage
    echo    ✅ Health checks for all services
    echo    ✅ Ready for Docker Hub upload
    echo.
    echo 🚀 To upload to Docker Hub:
    echo    1. docker tag socteamup-backend-prod your-dockerhub-username/socteamup-backend:latest
    echo    2. docker tag socteamup-frontend-prod your-dockerhub-username/socteamup-frontend:latest
    echo    3. docker push your-dockerhub-username/socteamup-backend:latest
    echo    4. docker push your-dockerhub-username/socteamup-frontend:latest
    echo.
) else (
    echo.
    echo ❌ ERROR: Failed to start production containers.
    echo Check the error messages above.
    echo.
    echo 🔍 Troubleshooting:
    echo    1. Make sure Docker Desktop is running
    echo    2. Check if ports 3000, 3001, 3306 are available
    echo    3. Ensure all Dockerfile and package.json files exist
    echo    4. Run: docker compose -f docker-compose-production.yml logs
    echo.
)

echo.
echo 📋 Container Management Commands:
echo    View logs:    docker compose -f docker-compose-production.yml logs
echo    Stop all:     docker compose -f docker-compose-production.yml down
echo    Restart:      docker compose -f docker-compose-production.yml restart
echo    Build fresh:  docker compose -f docker-compose-production.yml up --build --force-recreate
echo.
pause 