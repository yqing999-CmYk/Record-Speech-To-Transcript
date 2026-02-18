@echo off
title RecordSpeechToTranscript Backend
cd /d "%~dp0"

echo ============================================
echo  RecordSpeechToTranscript - Backend Server
echo ============================================
echo.

:: Create venv if it doesn't exist yet
if not exist "venv\Scripts\activate.bat" (
    echo [SETUP] Virtual environment not found. Creating...
    py -m venv venv
    echo [SETUP] Installing dependencies, please wait...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    echo.
    echo [SETUP] Done!
) else (
    call venv\Scripts\activate.bat
)

:: Check .env exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Please copy .env.example to .env and add your OPENAI_API_KEY.
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting server on http://0.0.0.0:8000
echo [INFO] Press Ctrl+C to stop.
echo.
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause
