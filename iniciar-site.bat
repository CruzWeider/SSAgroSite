@echo off
chcp 65001 > nul
title Servidor Local - Novo Site SS Agro
cd /d "%~dp0"
echo ============================================================================
echo   SS AGRO - NOVO SITE INSTITUCIONAL
echo   Iniciando servidor local em: http://localhost:8080
echo ============================================================================
echo.
start http://localhost:8080
python server.py
pause
