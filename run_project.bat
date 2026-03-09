@echo off
echo Starting Flower Shop Project...

:: Start Docker Database
echo Starting PostgreSQL via Docker...
docker-compose up -d

:: Wait for DB to be ready
timeout /t 5 /nobreak > nul

:: Setup Backend
echo Setting up Backend...
cd backend
call npx prisma generate
start "Backend" cmd /k "npm run start:dev"

:: Setup Client
echo Starting Client...
cd ../client
start "Client" cmd /k "npm run dev"

:: Setup Admin
echo Starting Admin...
cd ../admin
start "Admin" cmd /k "npm run dev"

echo All services are starting up.
echo Backend: http://localhost:3100
echo Client: http://localhost:3003
echo Admin: http://localhost:3004
pause
