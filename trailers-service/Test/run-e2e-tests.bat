@echo off
echo ========================================
echo   Trailers Service E2E Tests (Postman)
echo ========================================
echo.

REM Check if node_modules exists
if not exist "..\node_modules" (
    echo Installing dependencies...
    cd ..
    call npm install
    cd test
)

REM Check if Newman is installed
where newman >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Newman globally...
    call npm install -g newman
)

REM Check if pg package is installed
if not exist "..\node_modules\pg" (
    echo Installing pg package...
    cd ..
    call npm install pg
    cd test
)

echo.
echo Starting E2E tests...
echo.

REM Run the tests
node run-postman-tests.js

echo.
echo ========================================
echo   Test execution completed
echo ========================================
pause