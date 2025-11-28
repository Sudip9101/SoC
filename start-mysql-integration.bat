@echo off
echo ==========================================
echo    Starting SoCTeamup MySQL Integration
echo ==========================================
echo.

echo Adding Node.js and Docker to PATH...
set PATH=%PATH%;C:\Program Files\nodejs
set PATH=%PATH%;C:\Program Files\Docker\Docker\resources\bin

echo.
echo Checking Docker...
docker --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not available. Please start Docker Desktop first.
    echo.
    echo To start Docker Desktop:
    echo 1. Press Windows + R
    echo 2. Type: "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo 3. Press Enter and wait for Docker to start
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo.
echo Checking Node.js...
npm --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not available.
    pause
    exit /b 1
)

echo.
echo Stopping any existing containers...
docker-compose down 2>nul

echo.
echo Building and starting containers...
docker-compose up --build -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS! All containers are running.
    echo.
    echo 🌐 Access Points:
    echo    Frontend:     http://localhost:3000
    echo    Backend:      http://localhost:3001  
    echo    MySQL:        localhost:3306
    echo    Admin Panel:  http://localhost:3000/admin/auth-logs
    echo.
    echo 🔐 Test Authentication:
    echo    Go to: http://localhost:3000/login
    echo    Create a new account or use existing credentials
    echo.
    echo 📊 Monitor Database:
    echo    Admin Dashboard: http://localhost:3000/admin/auth-logs
    echo.
    echo Container Status:
    docker-compose ps
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 >nul
    start http://localhost:3000
    echo.
    echo 💡 Useful Commands:
    echo    View logs:    docker-compose logs
    echo    Stop all:     docker-compose down
    echo    Restart:      docker-compose restart
    echo.
) else (
    echo.
    echo ❌ ERROR: Failed to start containers.
    echo Check the error messages above.
    echo.
)

echo.
echo 🧪 To test MySQL integration:
echo    Run: powershell -ExecutionPolicy Bypass -File .\test-mysql-integration.ps1
echo.
pause 