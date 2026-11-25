@echo off
chcp 65001 > nul
title Servidor Local - Novo Site SS Agro
cd /d "%~dp0"
set PORT=8080
echo ============================================================================
echo   SS AGRO - NOVO SITE INSTITUCIONAL
echo   Iniciando servidor local em: http://localhost:8080
echo ============================================================================
echo.
start http://localhost:8080

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    node server.js
    goto fim
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python server.py
    goto fim
)

echo [AVISO] Node.js ou Python não foram encontrados no PATH.
:fim
pause
