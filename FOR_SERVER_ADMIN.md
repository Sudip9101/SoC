# For Server Administrator

## The Problem
Your current docker-compose.yml is missing the MySQL database container, causing connection errors.

## The Solution
Replace your `/root/website/docker-compose.yml` with the file `docker-compose-for-server.yml` (attached).

## Quick Fix Commands

Run these on the server:

```bash
cd /root/website

# Stop existing containers
docker-compose down

# Remove old containers
docker rm -f backend frontend mysql 2>/dev/null

# Replace docker-compose.yml (backup the old one first)
cp docker-compose.yml docker-compose.yml.old

# Copy new docker-compose.yml content (see attached file)

# Pull images
docker-compose pull

# Start services
docker-compose up -d

# Wait for services to start
sleep 60

# Check status
docker-compose ps
docker-compose logs backend --tail 20
curl http://localhost:3001/health
```

## Expected Result

After running above commands, you should see:

```
NAME       STATUS
mysql      Up (healthy)
backend    Up (healthy)
frontend   Up

Backend logs:
✅ Email transporter configured
✅ Database connected successfully
✅ Server started successfully!
📊 Database: Connected
📧 Email: Enabled
```

## Access
- Frontend: http://YOUR_SERVER_IP:3000
- Backend: http://YOUR_SERVER_IP:3001
- Health: http://YOUR_SERVER_IP:3001/health



