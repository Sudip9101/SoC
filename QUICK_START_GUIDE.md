# SoCTeamUp - Quick Start Guide

## ✅ Issue Fixed!

The MySQL connection error has been resolved. The backend now includes:
- **Retry Logic**: Automatically retries MySQL connection up to 10 times
- **Graceful Degradation**: Server starts even if database is temporarily unavailable
- **Background Reconnection**: Continues attempting to connect in the background

## 🚀 Running the Project

### Using Docker Compose (Recommended)

Start all services (Frontend, Backend, MySQL):

```bash
docker-compose up -d
```

Stop all services:

```bash
docker-compose down
```

Rebuild and restart (after code changes):

```bash
docker-compose up -d --build
```

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main website |
| Backend API | http://localhost:3001 | REST API |
| Health Check | http://localhost:3001/health | Server status |
| MySQL | localhost:3306 | Database |

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Check Status

```bash
docker-compose ps
```

### Check Backend Health

```bash
curl http://localhost:3001/health
```

Or open in browser: http://localhost:3001/health

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-06T21:37:44.409Z",
  "server": "SocTeamUp Backend (Production)",
  "database": "connected"
}
```

## 🔐 Demo Credentials

### Regular User
- Email: `demo@socteamup.com`
- Password: `password123`

### Admin User
- Email: `admin@socteamup.com`
- Password: `admin123456`

## 🛠️ Database Configuration

Current settings (can be changed in `docker-compose.yml`):

```yaml
DB_HOST: mysql
DB_PORT: 3306
DB_NAME: socteamup_db
DB_USER: socteamup_user
DB_PASSWORD: socteamup_password
```

### Initialize Database

The database is automatically initialized on first run using `database/init.sql`.

To manually initialize:

```bash
docker exec -i soc-mysql-1 mysql -u root -proot_password socteamup_db < database/init.sql
```

## 🐛 Troubleshooting

### Backend Can't Connect to MySQL

**Fixed!** The backend now retries automatically. Check logs:

```bash
docker-compose logs backend
```

You should see:
```
✅ Database connected successfully
```

### Port Already in Use

If you see "port already in use" errors:

```bash
# Stop conflicting services
docker stop $(docker ps -aq)

# Or change ports in docker-compose.yml
```

### Reset Everything

To completely reset (⚠️ deletes all data):

```bash
docker-compose down -v
docker-compose up -d --build
```

### Backend Still Can't Connect

1. Check if MySQL container is running:
   ```bash
   docker-compose ps mysql
   ```

2. Check MySQL logs:
   ```bash
   docker-compose logs mysql
   ```

3. Verify network connectivity:
   ```bash
   docker exec soc-backend-1 ping -c 3 mysql
   ```

## 📝 API Endpoints

### Authentication

```bash
# Register
POST http://localhost:3001/api/auth/register
Body: { "email": "user@example.com", "name": "User Name", "password": "password" }

# Login
POST http://localhost:3001/api/auth/login
Body: { "email": "user@example.com", "password": "password" }
```

### Contact Form

```bash
POST http://localhost:3001/api/contact
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question",
  "message": "Hello!"
}
```

### Admin (Auth Logs)

```bash
GET http://localhost:3001/api/admin/auth-logs?limit=10&offset=0
```

## 🔄 Development Workflow

### Making Backend Changes

1. Edit `server-production.js`
2. Rebuild and restart:
   ```bash
   docker-compose up -d --build backend
   ```

### Making Frontend Changes

1. Edit files in `src/`
2. Changes auto-reload in development mode
3. For production rebuild:
   ```bash
   docker-compose up -d --build frontend
   ```

### Database Schema Changes

1. Edit `database/init.sql`
2. Reset database:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

## 📦 Project Structure

```
SoC/
├── src/                    # Frontend source (Next.js)
├── server-production.js    # Backend server (Express + MySQL)
├── database/               # Database schema and init scripts
├── docker-compose.yml      # Docker services configuration
├── Dockerfile.backend-production
├── Dockerfile.frontend
└── package.json
```

## 🎯 What Was Fixed

### Before
```
❌ Database connection failed: Error: getaddrinfo EAI_AGAIN mysql
❌ Failed to connect to database. Server not starting.
```

### After
```
🚀 Starting SocTeamUp Backend Server (Production)...
❌ Database connection failed (attempt 1/10): connect ECONNREFUSED
⏳ Retrying in 5 seconds...
❌ Database connection failed (attempt 2/10): connect ECONNREFUSED
⏳ Retrying in 5 seconds...
✅ Database connected successfully
✅ Server started successfully!
📡 Listening on port 3001
📊 Database: Connected
```

### Key Improvements

1. **Retry Logic**: Up to 10 attempts with 5-second delays
2. **Error Handling**: Server starts even if DB is unavailable
3. **Background Reconnection**: Continues trying every 30 seconds
4. **Graceful Degradation**: API returns 503 for DB-dependent operations

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f`
2. Verify all containers are running: `docker-compose ps`
3. Test backend health: `curl http://localhost:3001/health`
4. Check database connection: `docker exec soc-backend-1 nc -zv mysql 3306`

---

**Project is now running successfully! 🎉**

Access your application at: http://localhost:3000

