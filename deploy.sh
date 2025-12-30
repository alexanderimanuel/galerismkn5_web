# Production Deployment Script for Galeri SMKN5
echo "🚀 Starting production deployment..."

# 1. Cek file .env
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please copy .env.example to .env and configure it."
    exit 1
fi

# 2. Build & Restart Container
echo "📦 Building and starting containers..."
docker compose -f docker-compose.prod.yaml up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 10

# 3. Setup Laravel
echo "🔧 Running Laravel setup commands..."

# Bersihkan cache lama
docker compose -f docker-compose.prod.yaml exec backend php artisan optimize:clear

# Cache config baru
docker compose -f docker-compose.prod.yaml exec backend php artisan config:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan route:cache
docker compose -f docker-compose.prod.yaml exec backend php artisan view:cache

# Generate Storage Link
docker compose -f docker-compose.prod.yaml exec backend php artisan storage:link

# Ensure Excel import template exists
echo "📋 Ensuring Excel import template exists..."
docker compose -f docker-compose.prod.yaml exec backend test -f /var/www/html/storage/app/template_import_siswa.xlsx || echo "Template file not found, will be generated dynamically when requested"

# Migrasi Database
docker compose -f docker-compose.prod.yaml exec backend php artisan migrate --force

# 4. FIX PERMISSION STORAGE (Untuk Upload Laravel)
echo "🔒 Setting proper permissions for Laravel Storage..."
docker compose -f docker-compose.prod.yaml exec backend chown -R www-data:www-data /var/www/html/storage
docker compose -f docker-compose.prod.yaml exec backend chmod -R 775 /var/www/html/storage

# 5. FIX PERMISSION NGINX TEMP (Untuk Upload Nginx/Buffer) - NEW FIX!
echo "🔒 Setting proper permissions for Nginx Temp..."
# Buat foldernya dulu karena error 'No such file' sebelumnya
docker compose -f docker-compose.prod.yaml exec backend mkdir -p /var/lib/nginx/tmp/client_body
# Ubah pemiliknya ke www-data (user yang menjalankan nginx/php)
docker compose -f docker-compose.prod.yaml exec backend chown -R www-data:www-data /var/lib/nginx
docker compose -f docker-compose.prod.yaml exec backend chmod -R 775 /var/lib/nginx

echo "✅ Deployment completed!"
echo "   Frontend: 3001"
echo "   Backend:  8001"