@echo off
echo ========================================
echo   Starting Green AI Monitor Backend
echo ========================================
echo.

cd backend

echo Checking if backend is already running...
curl -s http://localhost:8000/api/v1/stats/live >nul 2>&1
if %errorlevel% == 0 (
    echo Backend is already running on port 8000!
    echo.
    echo Testing API endpoint...
    curl http://localhost:8000/api/v1/stats/live
    echo.
    echo ========================================
    pause
    exit /b
)

echo Starting backend server...
echo.
echo Backend will run on: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

uvicorn app.main:app --reload
