@echo off
chcp 65001 > nul
title AI Task Manager - запуск всех сервисов

echo ============================================
echo   Запуск AI Task Manager
echo ============================================
echo.
echo   Backend  (Node.js)   : http://localhost:5000
echo   Python   (FastAPI)   : http://localhost:8000
echo   Frontend (React)     : http://localhost:3000
echo.
echo   Закройте это окно, чтобы остановить все сервисы.
echo ============================================
echo.

cd /d "%~dp0"

start "Backend (Node.js)"  cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

start "Python (FastAPI)"   cmd /k "cd python && python -m uvicorn analyzer:app --reload --port 8000"
timeout /t 3 /nobreak > nul

start "Frontend (React)"   cmd /k "cd frontend && npm start"

echo.
echo Все сервисы запускаются в отдельных окнах...
echo Подождите 10-15 секунд, пока всё загрузится.
echo.

timeout /t 5 /nobreak > nul
start http://localhost:3000