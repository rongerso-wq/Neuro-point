@echo off
echo Starting Solventum Clinical Hub...
cd /d "%~dp0"
start "" "http://localhost:3333"
npx serve . -p 3333 -s
pause
