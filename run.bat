@echo off
echo Starting backend and frontend...

start cmd /k "cd store-rating-app-backend && npm start"
start cmd /k "cd store-rating-app-frontend && npm start"

pause
