# SoCTeamUp - DevOps Deployment Package

## 📦 Docker Images Available

**All images are already built and available on Docker Hub:**

### Backend (with all fixes):
```
docker pull rackssudip/socteamup-backend:latest
docker pull rackssudip/socteamup-backend:v1.0
```
- Size: ~203 MB
- Node.js 18 Alpine
- **Features**: MySQL with retry logic, Email notifications, Authentication, CORS configured

### Frontend:
```
docker pull rackssudip/socteamup-frontend:latest
docker pull rackssudip/socteamup-frontend:v1.0
```
- Size: ~2.15 GB
- Next.js 15 production build
- **Features**: Responsive design, Contact forms, Admin dashboard

### Database:
```
docker pull mysql:8.0
```
- Official MySQL 8.0 image

---

## ⚠️ CRITICAL FIXES APPLIED

### Issue 1: MySQL Connection Error (FIXED ✅)
**Error:** `connect ECONNREFUSED 172.18.0.2:3306`

**Root Cause:** Missing MySQL container in docker-compose.yml

**Fix Applied:**
- Added MySQL service to docker-compose.yml
- Configured healthcheck for MySQL
- Backend now waits for MySQL to be healthy before starting
- Added connection retry logic (10 attempts, 5-second delays)

### Issue 2: Missing Environment Variables (FIXED ✅)
**Error:** `DB_HOST: backend` (incorrect)

**Fix Applied:**
- Set `DB_HOST: mysql` (correct)
- Added all required database environment variables
- Added all SMTP email configuration variables

### Issue 3: Email Configuration (FIXED ✅)
**Error:** `nodemailer.createTransporter is not a function`

**Fix Applied:**
- Fixed typo: `createTransporter` → `createTransport`
- Added nodemailer package
- Configured Gmail SMTP with app password
- Email notifications now working

---

## 🚀 Production Deployment Instructions

### Step 1: Create docker-compose.yml

Use the provided `docker-compose-production-final.yml` file.

**Key Points:**
- ✅ MySQL container included with healthcheck
- ✅ Backend depends on MySQL being healthy
- ✅ Frontend depends on backend
- ✅ All environment variables configured
- ✅ Persistent volumes for MySQL data
- ✅ Network isolation with bridge network

### Step 2: Configure Environment Variables

**MUST UPDATE before production:**

```yaml
environment:
  # Database (change passwords!)
  MYSQL_ROOT_PASSWORD: YOUR_STRONG_PASSWORD_HERE
  MYSQL_PASSWORD: YOUR_STRONG_PASSWORD_HERE
  DB_PASSWORD: YOUR_STRONG_PASSWORD_HERE
  
  # Email (get Gmail App Password)
  SMTP_PASS: YOUR_GMAIL_APP_PASSWORD_HERE
  
  # Security (generate random secret)
  JWT_SECRET: YOUR_RANDOM_JWT_SECRET_32_CHARS
```

### Step 3: Deploy

```bash
# Create deployment directory
mkdir -p /opt/socteamup
cd /opt/socteamup

# Copy docker-compose.yml
# (use the provided docker-compose-production-final.yml)

# Pull images
docker-compose pull

# Start services
docker-compose up -d

# Wait for initialization
sleep 60

# Verify deployment
docker-compose ps
docker-compose logs backend --tail 30
curl http://localhost:3001/health
```

### Step 4: Verify Deployment

**Expected Output:**

```bash
$ docker-compose ps
NAME       STATUS
mysql      Up (healthy)
backend    Up (healthy)
frontend   Up

$ curl http://localhost:3001/health
{
  "status": "ok",
  "database": "connected",
  "email": "enabled"
}
```

---

## 📋 Complete docker-compose.yml for Production

```yaml
version: "3.9"

services:
  # MySQL Database Service
  mysql:
    image: mysql:8.0
    container_name: socteamup_mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root_password_CHANGE_ME}
      MYSQL_DATABASE: socteamup_db
      MYSQL_USER: socteamup_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-socteamup_password_CHANGE_ME}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - socnet
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD:-root_password_CHANGE_ME}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s

  # Backend API Service
  backend:
    image: rackssudip/socteamup-backend:v1.0
    container_name: socteamup_backend
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: production
      PORT: 3001
      # Database Configuration
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: socteamup_db
      DB_USER: socteamup_user
      DB_PASSWORD: ${MYSQL_PASSWORD:-socteamup_password_CHANGE_ME}
      # Email Configuration
      SMTP_ENABLED: "true"
      SMTP_HOST: ${SMTP_HOST:-smtp.gmail.com}
      SMTP_PORT: ${SMTP_PORT:-587}
      SMTP_SECURE: "false"
      SMTP_USER: ${SMTP_USER:-socteamup28@gmail.com}
      SMTP_PASS: ${SMTP_PASS:-CHANGE_ME}
      SMTP_FROM: ${SMTP_FROM:-socteamup28@gmail.com}
      SMTP_TO: ${SMTP_TO:-socteamup28@gmail.com}
      # Security
      JWT_SECRET: ${JWT_SECRET:-change-this-in-production-to-random-32-char-string}
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - socnet
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend Web Service
  frontend:
    image: rackssudip/socteamup-frontend:v1.0
    container_name: socteamup_frontend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: ${FRONTEND_API_URL:-http://localhost:3001}
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - socnet
    restart: unless-stopped

networks:
  socnet:
    driver: bridge

volumes:
  mysql_data:
    driver: local
```

---

## 🔐 Security Checklist

Before production deployment:

- [ ] Change `MYSQL_ROOT_PASSWORD`
- [ ] Change `MYSQL_PASSWORD` / `DB_PASSWORD`
- [ ] Generate random `JWT_SECRET` (32+ characters)
- [ ] Get Gmail App Password for `SMTP_PASS`
- [ ] Update `SMTP_TO` with actual notification email
- [ ] Enable firewall (only ports 80, 443, optionally 3000/3001)
- [ ] Set up SSL/TLS certificates (Let's Encrypt)
- [ ] Configure backup for `mysql_data` volume
- [ ] Set up monitoring/logging

---

## 📊 Resource Requirements

### Minimum:
- CPU: 2 cores
- RAM: 4 GB
- Disk: 20 GB
- OS: Linux (Ubuntu 20.04+ recommended)

### Recommended:
- CPU: 4 cores
- RAM: 8 GB
- Disk: 50 GB SSD
- OS: Ubuntu 22.04 LTS

### Docker Version:
- Docker: 20.10+
- Docker Compose: 2.0+

---

## 🔍 Health Checks & Monitoring

### Backend Health:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-07T...",
  "server": "SocTeamUp Backend (Production with Email)",
  "database": "connected",
  "email": "enabled"
}
```

### Database Health:
```bash
docker exec socteamup_mysql mysqladmin ping -h localhost -u root -pPASSWORD
```

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Last 100 lines
docker-compose logs --tail=100
```

---

## 🛠️ Management Commands

### Start Services:
```bash
docker-compose up -d
```

### Stop Services:
```bash
docker-compose down
```

### Restart Services:
```bash
docker-compose restart
```

### Update to Latest:
```bash
docker-compose pull
docker-compose up -d
```

### Backup Database:
```bash
docker exec socteamup_mysql mysqldump -u root -pPASSWORD socteamup_db > backup_$(date +%Y%m%d).sql
```

### Restore Database:
```bash
docker exec -i socteamup_mysql mysql -u root -pPASSWORD socteamup_db < backup.sql
```

---

## 🌐 Port Configuration

| Port | Service | Description | Public Access |
|------|---------|-------------|---------------|
| 3000 | Frontend | Web interface | ✅ Yes |
| 3001 | Backend | REST API | ✅ Yes |
| 3306 | MySQL | Database | ❌ No (internal only) |

**Firewall Configuration:**
```bash
# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow application ports (optional, for direct access)
ufw allow 3000/tcp
ufw allow 3001/tcp

# DO NOT expose MySQL
# ufw deny 3306/tcp
```

---

## 🚨 Troubleshooting

### Issue: Backend can't connect to MySQL
**Solution:** Check MySQL is healthy
```bash
docker-compose logs mysql
docker exec socteamup_mysql mysqladmin ping -h localhost -u root -pPASSWORD
```

### Issue: Email not sending
**Solution:** Verify SMTP credentials
```bash
docker-compose logs backend | grep -i email
curl http://localhost:3001/health | jq '.email'
```

### Issue: Port already in use
**Solution:** Find and stop conflicting service
```bash
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :3306
```

### Issue: Frontend shows 502 Bad Gateway
**Solution:** Backend not ready, wait or check logs
```bash
docker-compose logs backend
curl http://localhost:3001/health
```

---

## 📧 Email Configuration (Gmail)

### Getting Gmail App Password:

1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already)
3. Security → 2-Step Verification → App passwords
4. Select "Mail" → "Other" → Name: "SoCTeamUp"
5. Copy 16-character password
6. Update `SMTP_PASS` in docker-compose.yml

### Alternative SMTP Providers:

**SendGrid:**
```yaml
SMTP_HOST: smtp.sendgrid.net
SMTP_PORT: 587
SMTP_USER: apikey
SMTP_PASS: YOUR_SENDGRID_API_KEY
```

**AWS SES:**
```yaml
SMTP_HOST: email-smtp.us-east-1.amazonaws.com
SMTP_PORT: 587
SMTP_USER: YOUR_AWS_SMTP_USERNAME
SMTP_PASS: YOUR_AWS_SMTP_PASSWORD
```

---

## 🔄 Update Process

When new version is released:

```bash
# Pull new images
docker pull rackssudip/socteamup-backend:latest
docker pull rackssudip/socteamup-frontend:latest

# Backup database
docker exec socteamup_mysql mysqldump -u root -pPASSWORD socteamup_db > backup_before_update.sql

# Update services
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs backend --tail 50
curl http://localhost:3001/health
```

---

## 📊 Monitoring Setup (Optional)

### Prometheus + Grafana:
Add to docker-compose.yml for monitoring

### Log Aggregation:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Loki + Grafana
- CloudWatch (if on AWS)

### Uptime Monitoring:
- UptimeRobot
- Pingdom
- StatusCake

---

## 🆘 Support & Contact

### Documentation:
- `README.md` - Project overview
- `DOCKER_HUB_DEPLOYMENT_GUIDE.md` - Detailed deployment
- `EMAIL_SETUP_COMPLETE.md` - Email configuration
- `ERROR_FIXED_SUMMARY.md` - All fixes applied

### Docker Hub:
- Backend: https://hub.docker.com/r/rackssudip/socteamup-backend
- Frontend: https://hub.docker.com/r/rackssudip/socteamup-frontend

### Quick Links:
- Frontend: http://YOUR_SERVER:3000
- Backend: http://YOUR_SERVER:3001
- Health: http://YOUR_SERVER:3001/health

---

## ✅ Pre-Deployment Checklist

DevOps team should verify:

- [ ] Docker and Docker Compose installed
- [ ] Server meets minimum requirements
- [ ] All ports available (3000, 3001, 3306)
- [ ] docker-compose.yml file ready
- [ ] Environment variables configured
- [ ] Passwords changed from defaults
- [ ] Gmail App Password obtained
- [ ] Firewall rules configured
- [ ] SSL certificates ready (for HTTPS)
- [ ] Backup strategy defined
- [ ] Monitoring tools setup
- [ ] DNS records configured

---

## 📦 Deployment Package Contents

Files to provide to DevOps:

1. ✅ `docker-compose-production-final.yml` - Production config
2. ✅ `DEVOPS_DEPLOYMENT_PACKAGE.md` - This file
3. ✅ `FOR_SERVER_ADMIN.md` - Quick reference
4. ✅ `.env.example` - Environment template
5. ✅ Docker Hub links to pull images

---

## 🎯 Summary

**Images:** ✅ Built and on Docker Hub  
**MySQL Issue:** ✅ Fixed with retry logic  
**Email Issue:** ✅ Fixed and configured  
**Environment:** ✅ All variables documented  
**Documentation:** ✅ Complete  
**Ready for Deployment:** ✅ YES  

**DevOps can deploy immediately using provided docker-compose.yml!**

---

**Last Updated:** November 2025  
**Version:** 1.0  
**Status:** Production Ready ✅



