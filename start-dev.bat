@echo off
setlocal
echo Starting 24 Digitals Dashboard Localhost...

set "LOCAL_NODE_PATH=%~dp0..\node-bin\node-v24.14.1-win-x64"
if exist "%LOCAL_NODE_PATH%\node.exe" (
    echo Using portable Node.js from %LOCAL_NODE_PATH%
    set "PATH=%LOCAL_NODE_PATH%;%PATH%"
) else (
    echo Portable Node.js not found in %LOCAL_NODE_PATH%. Checking system PATH...
    where node >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Node.js is not installed and portable version not found!
        echo Please download and install it from https://nodejs.org/
        pause
        exit /b
    )
)

echo Node.js version:
node -v

echo Installing dependencies (this may take a few minutes)...
call npm install

echo Starting Development Server...
npm run dev
pause
