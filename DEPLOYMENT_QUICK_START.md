# Quick Start for DevOps Team

## ⚡ 5-Minute Deployment

### Prerequisites:
```bash
# Install Docker & Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Deploy:

```bash
# 1. Create directory
mkdir -p /opt/socteamup && cd /opt/socteamup

# 2. Download docker-compose.yml
# (Copy docker-compose-production-final.yml to here as docker-compose.yml)

# 3. Create .env file
cat > .env << 'EOF'
MYSQL_ROOT_PASSWORD=your-strong-password
MYSQL_PASSWORD=your-strong-password
SMTP_PASS=your-gmail-app-password
JWT_SECRET=your-random-32-char-secret
EOF

# 4. Pull and start
docker-compose pull
docker-compose up -d

# 5. Wait and verify
sleep 60
docker-compose ps
curl http://localhost:3001/health
```

### Access:
- Frontend: http://YOUR_SERVER_IP:3000
- Backend: http://YOUR_SERVER_IP:3001
- Health: http://YOUR_SERVER_IP:3001/health

---

## ✅ Verification

Should see:
```json
{
  "status": "ok",
  "database": "connected",
  "email": "enabled"
}
```

---

## 📦 Files Needed:
1. `docker-compose-production-final.yml` (rename to docker-compose.yml)
2. `.env` (create from .env.example)

---

## 🔐 Before Production:
- [ ] Change all passwords in .env
- [ ] Get Gmail App Password
- [ ] Generate JWT secret: `openssl rand -base64 32`
- [ ] Set up firewall
- [ ] Configure SSL/TLS

---

## 📞 Support:
See: `DEVOPS_DEPLOYMENT_PACKAGE.md` for complete documentation



