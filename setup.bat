@echo off
echo 🚀 Starting Todo App Setup...

:: Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

:: Stop any existing containers
echo 🛑 Stopping any existing containers...
docker-compose down

:: Build and start the services
echo 🔨 Building and starting services...
docker-compose up --build -d

:: Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

:: Check if services are running
echo 🔍 Checking service status...

docker-compose ps database | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Database is running
) else (
    echo ❌ Database failed to start
)

docker-compose ps backend | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Backend is running
) else (
    echo ❌ Backend failed to start
)

docker-compose ps frontend | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend is running
) else (
    echo ❌ Frontend failed to start
)

echo.
echo 🎉 Todo App is ready!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 🗄️  Database: localhost:3306
echo.
echo To stop the application, run: docker-compose down
echo To view logs, run: docker-compose logs -f
echo.
pause
