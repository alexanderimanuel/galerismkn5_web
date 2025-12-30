@echo off
echo 🚀 Starting production deployment...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found! Please copy .env.example to .env and configure it.
    exit /b 1
)

echo 📦 Building and starting containers...
docker-compose -f docker-compose.prod.yaml down
docker-compose -f docker-compose.prod.yaml build --no-cache
docker-compose -f docker-compose.prod.yaml up -d

echo ⏳ Waiting for database to be ready...
timeout /t 30 /nobreak >nul

echo 🔧 Running Laravel setup commands...
docker-compose -f docker-compose.prod.yaml exec backend php artisan key:generate --force
docker-compose -f docker-compose.prod.yaml exec backend php artisan config:cache
docker-compose -f docker-compose.prod.yaml exec backend php artisan route:cache
docker-compose -f docker-compose.prod.yaml exec backend php artisan view:cache
docker-compose -f docker-compose.prod.yaml exec backend php artisan migrate --force

echo 🔒 Setting proper permissions...
docker-compose -f docker-compose.prod.yaml exec backend chown -R www-data:www-data /var/www/html/storage
docker-compose -f docker-compose.prod.yaml exec backend chmod -R 775 /var/www/html/storage

echo ✅ Production deployment completed!
echo 📝 Services running:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    MySQL: localhost:3306
echo    Redis: localhost:6379
echo.
echo 🔗 Configure your Caddy to proxy:
echo    yourdomain.com → localhost:3000 (Frontend)
echo    api.yourdomain.com → localhost:8000 (API)

pause