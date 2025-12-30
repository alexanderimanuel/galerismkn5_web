# SMKN 5 Malang Final Project Gallery

A centralized platform for collecting, showcasing, and assessing final projects of SMKN 5 Malang students. This system is designed with a decoupled architecture to ensure scalability.

---

## 🚀 Key Features

* Public Gallery: Showcase student work that is publicly accessible without logging in.
* Student Dashboard: Upload project links (GDrive/YouTube/Github) and monitor grade status.
* Teacher Dashboard: Review projects by major and assign star ratings (1-5).
* Super Admin (Principal/Vice Principal): User management and full control over access rights (Role Management).
* PWA Ready: Can be installed on Android/iOS devices for quick access like a native app.

---

## 🛠️ Tech Stack

### Frontend
* Framework: Next.js 14+ (App Router)
* Styling: Tailwind CSS
* State Management: React Hooks & Context API
* Capabilities: Progressive Web App (PWA)

### Backend (API)
* Framework: Laravel 11 (API-only mode)
* Authentication: Laravel Sanctum (Stateful & Token-based)
* Database: MySQL 8.0

### DevOps & Infrastructure
* Containerization: Docker & Docker Compose
* Web Server/Proxy: Caddy / Nginx (Optimized for Reverse Proxy)
* Deployment: Git-based workflow

---

## 📂 Monorepo Structure

.
├── backend/ # Laravel API Source Code
├── frontend/ # Next.js Frontend Source Code
├── docker-compose.yml # Docker Orchestration
└── README.md

---

## ⚙️ Server Requirements (Minimum)

* OS: Linux (Ubuntu 20.04+ recommended)
* RAM: 2 GB
* Storage: 20 GB (Metadata only, main files are hosted on an external service)
* Dependencies: Docker Engine & Docker Compose

---

## 🚀 Installation Guide (Production)

This system is packaged using Docker to ensure environment isolation and ease of deployment.

1. Clone the Repository
git clone https://github.com/afifalhauzan/galerismkn5_web.git
cd galerismkn5_web

2. Configure the Environment
Copy the .env.example file into .env in each folder (backend & frontend) and adjust the variables (DB Credentials, APP_KEY, API URL).

3. Build and Run the script: chmod +x deploy.sh
./deploy.sh

5. Setup the Database (Only Once)
docker compose exec backend php artisan migrate --seed

---

## 🌐 Domain & SSL Configuration

This system is recommended to run behind a Reverse Proxy (such as Caddy or Nginx).

Example Caddyfile Configuration:
karya.smkn5malang.sch.id {
# Frontend (Next.js)
reverse_proxy localhost:3000

# Backend API (Laravel)
reverse_proxy /api/* localhost:8000
}
---

## 📄 License

Developed by the SMKN 5 Malang Capstone/PKL Team (2025).

