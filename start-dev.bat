@echo off
echo Starting Leafinity Development Servers...
echo.

echo [1/2] Starting Backend Server...
start "Leafinity Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server...
start "Leafinity Frontend" cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting in separate windows!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
