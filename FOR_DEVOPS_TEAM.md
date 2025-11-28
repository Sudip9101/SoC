# 📦 For DevOps Team - Deployment Package

## 🎯 Quick Overview

**Project:** SoCTeamUp - Team Building Platform  
**Tech Stack:** Next.js (Frontend) + Express.js (Backend) + MySQL  
**Deployment:** Docker Compose  
**Status:** ✅ Production Ready

---

## 📥 Docker Images (Ready to Pull)

All images are built and available on Docker Hub:

```bash
# Backend (with all fixes)
docker pull rackssudip/socteamup-backend:v1.0

# Frontend
docker pull rackssudip/socteamup-frontend:v1.0

# Database
docker pull mysql:8.0
```

---

## ⚡ Quick Deployment (5 Minutes)

### Step 1: Create Deployment Directory
```bash
mkdir -p /opt/socteamup
cd /opt/socteamup
```

### Step 2: Get docker-compose.yml
Copy the provided `docker-compose-production-final.yml` and rename it to `docker-compose.yml`

### Step 3: Configure Environment
Create `.env` file (use `env-example.txt` as template):

```bash
cat > .env << 'EOF'
# Change these values!
MYSQL_ROOT_PASSWORD=CHANGE_ME
MYSQL_PASSWORD=CHANGE_ME
SMTP_PASS=CHANGE_ME_GET_GMAIL_APP_PASSWORD
JWT_SECRET=CHANGE_ME_32_CHARS
SMTP_TO=admin@yourcompany.com
FRONTEND_API_URL=http://YOUR_SERVER_IP:3001
EOF
```

### Step 4: Deploy
```bash
docker-compose pull
docker-compose up -d
```

### Step 5: Verify (wait ~60 seconds for MySQL init)
```bash
sleep 60
docker-compose ps
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "email": "enabled"
}
```

---

## ✅ Deployment Checklist

### Before Deployment:
- [ ] Docker & Docker Compose installed on server
- [ ] Ports 3000, 3001, 3306 available
- [ ] `.env` file created with actual passwords
- [ ] Gmail App Password obtained
- [ ] Server meets requirements (4GB RAM, 20GB disk)

### During Deployment:
- [ ] Pull images from Docker Hub
- [ ] Start services with docker-compose
- [ ] Wait for MySQL initialization (30-60 seconds)
- [ ] Verify all containers healthy
- [ ] Test health endpoint

### After Deployment:
- [ ] Configure firewall (allow 80, 443, 3000, 3001)
- [ ] Set up SSL/TLS (Let's Encrypt recommended)
- [ ] Configure backups for mysql_data volume
- [ ] Set up monitoring/alerting
- [ ] Document admin credentials
- [ ] Test contact form and email notifications

---

## 🔐 Required Configurations

### 1. MySQL Passwords
Generate strong passwords:
```bash
# Generate random password
openssl rand -base64 24
```

Update in `.env`:
```
MYSQL_ROOT_PASSWORD=generated_password_here
MYSQL_PASSWORD=same_or_different_password
```

### 2. Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if not already)
3. Create new app password: "Mail" → "Other" → "SoCTeamUp"
4. Copy 16-character password
5. Update in `.env`: `SMTP_PASS=your16charpassword`

### 3. JWT Secret
Generate secure random string:
```bash
# Generate 32-byte random string
openssl rand -base64 32
```

Update in `.env`:
```
JWT_SECRET=generated_string_here
```

### 4. Notification Email
Update where notifications should go:
```
SMTP_TO=admin@yourcompany.com
```

### 5. Frontend API URL
For production with domain:
```
FRONTEND_API_URL=https://api.yourdomain.com
```

For production with IP:
```
FRONTEND_API_URL=http://YOUR_SERVER_IP:3001
```

---

## 🌐 Port Configuration

| Port | Service | Public Access | Purpose |
|------|---------|---------------|---------|
| 3000 | Frontend | ✅ Yes | Web interface |
| 3001 | Backend | ✅ Yes | REST API |
| 3306 | MySQL | ❌ No | Database (internal) |

### Firewall Setup:
```bash
# Allow web traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application ports (if not using reverse proxy)
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp

# DO NOT expose MySQL to public
# (only accessible within Docker network)
sudo ufw enable
```

---

## 📊 System Requirements

### Minimum (Testing):
- **OS:** Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+)
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disk:** 20 GB
- **Docker:** 20.10+
- **Docker Compose:** 2.0+

### Recommended (Production):
- **OS:** Ubuntu 22.04 LTS
- **CPU:** 4 cores
- **RAM:** 8 GB
- **Disk:** 50 GB SSD
- **Docker:** Latest stable
- **Docker Compose:** Latest stable

---

## 🔍 Health Monitoring

### Health Check Endpoint:
```bash
curl http://localhost:3001/health
```

**Healthy Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "email": "enabled",
  "server": "SocTeamUp Backend (Production with Email)",
  "timestamp": "2025-11-07T12:34:56.789Z"
}
```

### Container Status:
```bash
# Check all containers
docker-compose ps

# Should show:
# socteamup_mysql      Up (healthy)
# socteamup_backend    Up (healthy)
# socteamup_frontend   Up
```

### View Logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Last 50 lines
docker-compose logs --tail=50
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

# Or specific service:
docker-compose restart backend
```

### Update to Latest Version:
```bash
docker-compose pull
docker-compose up -d
```

### Backup Database:
```bash
docker exec socteamup_mysql mysqldump \
  -u root -p$MYSQL_ROOT_PASSWORD \
  socteamup_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database:
```bash
docker exec -i socteamup_mysql mysql \
  -u root -p$MYSQL_ROOT_PASSWORD \
  socteamup_db < backup.sql
```

### View Container Resources:
```bash
docker stats
```

---

## 🚨 Troubleshooting

### Issue: Backend can't connect to MySQL

**Symptoms:**
```
Database connection failed: ECONNREFUSED
```

**Solution:**
```bash
# Check MySQL is healthy
docker-compose logs mysql

# Wait for MySQL initialization
sleep 30

# Restart backend
docker-compose restart backend
```

**Note:** Backend has retry logic (10 attempts × 5 seconds) and should auto-recover.

---

### Issue: Email notifications not working

**Symptoms:**
```
Failed to send email
```

**Solution:**
```bash
# Check email configuration
docker-compose logs backend | grep -i email

# Verify in health check
curl http://localhost:3001/health | jq '.email'

# Should return: "enabled"
```

**Common Causes:**
- Wrong Gmail App Password
- Using regular password instead of App Password
- Gmail 2-Step Verification not enabled
- SMTP_PASS not set in .env

---

### Issue: Port already in use

**Symptoms:**
```
Error starting container: port is already allocated
```

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :3001

# Kill the process or change port in docker-compose.yml
```

---

### Issue: Container keeps restarting

**Solution:**
```bash
# Check logs for errors
docker-compose logs backend

# Common causes:
# - Missing environment variables
# - Database not healthy yet
# - Port conflicts
```

---

## 📁 Files Provided

### Essential Files:
1. ✅ `docker-compose-production-final.yml` - Production configuration
2. ✅ `env-example.txt` - Environment variables template
3. ✅ `DEVOPS_DEPLOYMENT_PACKAGE.md` - Complete documentation
4. ✅ `DEPLOYMENT_QUICK_START.md` - Quick reference
5. ✅ `ALL_FIXES_AND_DEPLOYMENT_SUMMARY.md` - All fixes applied

### Documentation:
- **README.md** - Project overview
- **DOCKER_HUB_DEPLOYMENT_GUIDE.md** - Docker Hub details
- **EMAIL_SETUP_COMPLETE.md** - Email configuration
- **ERROR_FIXED_SUMMARY.md** - Technical fixes

---

## 🔄 CI/CD Integration

### Docker Hub Webhook (Optional):
```bash
# Configure webhook in Docker Hub to auto-deploy on image update
curl -X POST https://your-server.com/webhook/deploy
```

### Automated Deployment Script:
See `auto-deploy.sh` for automated deployment with backup and verification.

---

## 📧 Contact Form Email Flow

When user submits contact form:

1. **Frontend** → Sends POST to `/api/contact`
2. **Backend** → Validates data
3. **Backend** → Sends notification email to `SMTP_TO`
4. **Backend** → Sends auto-reply to user
5. **Frontend** → Shows success message

**Test Contact Form:**
1. Go to: http://YOUR_SERVER:3000/contact
2. Fill and submit form
3. Check email at `SMTP_TO` address
4. Should receive notification within seconds

---

## 🎯 Success Criteria

Deployment is successful when:

- [ ] All 3 containers running and healthy
- [ ] Health endpoint returns "ok"
- [ ] Frontend accessible at port 3000
- [ ] Backend API responding at port 3001
- [ ] Database connection confirmed
- [ ] Email system enabled
- [ ] Contact form working
- [ ] Emails being received
- [ ] No errors in logs
- [ ] Containers survive restart

---

## 🆘 Support & Escalation

### Check These First:
1. Health endpoint: `curl http://localhost:3001/health`
2. Container status: `docker-compose ps`
3. Logs: `docker-compose logs --tail=100`
4. Environment: `docker-compose config`

### Common Issues:
- **Database connection:** Wait 60 seconds for MySQL init
- **Email not working:** Check Gmail App Password
- **Port conflicts:** Change ports in docker-compose.yml
- **Out of memory:** Increase RAM to 4GB minimum

### Documentation:
- See `DEVOPS_DEPLOYMENT_PACKAGE.md` for detailed troubleshooting
- See `ALL_FIXES_AND_DEPLOYMENT_SUMMARY.md` for what was fixed

---

## 📊 Monitoring Recommendations

### Basic Monitoring:
- Health check endpoint every 1 minute
- Container status monitoring
- Disk space alerts (mysql_data volume)
- Log error tracking

### Recommended Tools:
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Metrics:** Prometheus + Grafana
- **Logs:** ELK Stack or Loki
- **Alerts:** PagerDuty, Slack webhooks

### Prometheus Example:
```yaml
- job_name: 'socteamup'
  metrics_path: '/health'
  static_configs:
    - targets: ['localhost:3001']
```

---

## 🎉 Summary

### What's Ready:
- ✅ Docker images on Docker Hub
- ✅ Complete docker-compose.yml
- ✅ All configurations documented
- ✅ Health checks configured
- ✅ Email system working
- ✅ All errors fixed
- ✅ Production tested

### What You Need to Do:
1. Create `.env` file with real passwords
2. Run `docker-compose up -d`
3. Verify health check
4. Test contact form
5. Configure SSL/monitoring (optional)

### Deployment Time:
- **Setup:** 5 minutes
- **Verification:** 2 minutes
- **Total:** ~10 minutes

---

## ✅ Ready to Deploy!

**All fixed, tested, and production ready.**  
**Questions? See the detailed documentation in `DEVOPS_DEPLOYMENT_PACKAGE.md`**

---

**Last Updated:** November 2025  
**Version:** 1.0  
**Status:** Production Ready ✅



