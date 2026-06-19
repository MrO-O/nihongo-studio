@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"
title Nihongo Studio

echo.
echo ========================================
echo   Nihongo Studio
echo ========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Please install Node.js 20.19+ or 22.12+ first:
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Please reinstall Node.js with npm enabled.
  echo.
  pause
  exit /b 1
)

if /I "%~1"=="--check" (
  echo Startup script check passed.
  exit /b 0
)

if not exist "node_modules\" (
  echo Dependencies are missing. Installing now...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting local server at http://localhost:5173
echo If the browser opens before the app is ready, refresh it after a few seconds.
echo Keep this window open while studying. Press Ctrl+C to stop the server.
echo.

start "" "http://localhost:5173"
call npm run dev -- --host 127.0.0.1 --port 5173 --strictPort

echo.
echo Nihongo Studio has stopped.
pause
