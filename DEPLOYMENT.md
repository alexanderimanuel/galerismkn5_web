# Production Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- Caddy reverse proxy configured on your VPS
- Domain name pointing to your server

## Setup Instructions

### 1. Environment Configuration
```bash
# Copy and configure environment variables
cp .env.example .env

# Edit .env with your actual values:
# - DB_PASSWORD: Secure database password
# - APP_URL: Your API domain (https://api.yourdomain.com)
# - NEXT_PUBLIC_API_URL: Same as APP_URL
# - FRONTEND_DOMAIN: Your frontend domain
# - Mail configuration
```

### 2. Deploy to Production
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

### 3. Caddy Configuration
Add this to your Caddyfile on the VPS:

```caddy
# Frontend
yourdomain.com {
    reverse_proxy localhost:3000
}

# API Backend
api.yourdomain.com {
    reverse_proxy localhost:8000
    header {
        # Security headers
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

### 4. SSL/HTTPS
Caddy automatically handles SSL certificates via Let's Encrypt.

## Production Services

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | https://yourdomain.com |
| Backend API | 8000 | https://api.yourdomain.com |
| MySQL | 3306 | Internal only |
| Redis | 6379 | Internal only |

## Management Commands

```bash
# Check logs
docker-compose -f docker-compose.prod.yaml logs -f

# Stop services
docker-compose -f docker-compose.prod.yaml down

# Update application
git pull
docker-compose -f docker-compose.prod.yaml build --no-cache
docker-compose -f docker-compose.prod.yaml up -d

# Laravel commands
docker compose -f docker-compose.prod.yaml exec backend php artisan migrate
docker compose -f docker-compose.prod.yaml exec backend php artisan cache:clear

# Database backup
docker compose -f docker-compose.prod.yaml exec mysql mysqldump -u root -p galerismkn5 > backup.sql
```

## Security Checklist

- ✅ APP_DEBUG=false in production
- ✅ Strong database passwords
- ✅ HTTPS enforced via Caddy
- ✅ Security headers configured
- ✅ CORS properly configured
- ✅ Redis password protected (if needed)
- ✅ Regular backups scheduled

## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
docker-compose -f docker-compose.prod.yaml ps mysql

# Check logs
docker-compose -f docker-compose.prod.yaml logs mysql
```

### API Not Accessible
```bash
# Check backend logs
docker-compose -f docker-compose.prod.yaml logs backend

# Test API directly
curl http://localhost:8000/api/health
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose -f docker-compose.prod.yaml logs frontend

# Rebuild frontend
docker-compose -f docker-compose.prod.yaml build frontend --no-cache
```