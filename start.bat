@echo off
echo Starting PDF App...

REM Check Docker
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker is not running or not installed.
    echo Please install Docker Desktop and start it.
    pause
    exit
)

REM Pull latest image (first run only slow)
docker pull yourusername/pdf-app

REM Run container (or start if exists)
docker run -d -p 8000:8000 --name pdf-app-instance yourusername/pdf-app >nul 2>&1

IF %ERRORLEVEL% NEQ 0 (
    docker start pdf-app-instance
)

REM Wait a bit
timeout /t 2 >nul

REM Open browser
start http://localhost:8000/open-file.html

echo Done!