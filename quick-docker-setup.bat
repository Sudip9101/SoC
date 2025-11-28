@echo off
echo ==========================================
echo    Quick Docker Setup for SoCTeamup
echo ==========================================
echo.

echo Adding Docker and Node.js to PATH...
set PATH=%PATH%;C:\Program Files\Docker\Docker\resources\bin
set PATH=%PATH%;C:\Program Files\nodejs

echo.
echo Stopping any existing containers...
docker stop socteamup-mysql socteamup-frontend socteamup-backend 2>nul
docker rm socteamup-mysql socteamup-frontend socteamup-backend 2>nul

echo.
echo 1. Starting MySQL Database...
docker run -d --name socteamup-mysql ^
  -p 3306:3306 ^
  -e MYSQL_ROOT_PASSWORD=root_password ^
  -e MYSQL_DATABASE=socteamup_db ^
  -e MYSQL_USER=socteamup_user ^
  -e MYSQL_PASSWORD=socteamup_password ^
  mysql:8.0

echo Waiting for MySQL to start...
timeout /t 15 >nul

echo.
echo 2. Copying database schema...
docker cp database/init.sql socteamup-mysql:/tmp/init.sql
docker exec socteamup-mysql mysql -u root -proot_password socteamup_db < /tmp/init.sql 2>nul

echo.
echo 3. Building minimal backend image...
docker build -f Dockerfile.backend-minimal -t socteamup-backend-minimal .

echo.
echo 4. Starting backend container...
docker run -d --name socteamup-backend ^
  -p 3001:3001 ^
  --link socteamup-mysql:mysql ^
  -e DB_HOST=mysql ^
  -e DB_PORT=3306 ^
  -e DB_NAME=socteamup_db ^
  -e DB_USER=socteamup_user ^
  -e DB_PASSWORD=socteamup_password ^
  -e NODE_ENV=production ^
  socteamup-backend-minimal

echo Waiting for backend to start...
timeout /t 5 >nul

echo.
echo 5. Starting frontend in development mode...
start /B npm run dev

echo.
echo ✅ Quick setup complete!
echo.
echo 🌐 Access Points:
echo    Frontend (dev):  http://localhost:3000
echo    Backend:         http://localhost:3001
echo    MySQL:           localhost:3306
echo    Admin Panel:     http://localhost:3000/admin/auth-logs
echo.
echo 📊 Container Status:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🧪 Testing MySQL Integration...
echo Opening browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo 💡 To test authentication:
echo    1. Go to http://localhost:3000/login
echo    2. Register a new account
echo    3. Check admin panel: http://localhost:3000/admin/auth-logs
echo.
pause 