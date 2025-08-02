# Database Setup Guide

This guide explains how to set up and use the MySQL database for storing user information and contact form submissions.

## Overview

The application now includes a MySQL database container that runs alongside your frontend and backend services. This setup allows you to:

- Store user information and authentication data
- Log authentication attempts and user actions
- Store contact form submissions
- Manage blog posts (optional)

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   MySQL     │
│  (Next.js)  │◄──►│  (Express)  │◄──►│  Database   │
│   Port 3000 │    │  Port 3001  │    │  Port 3306  │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Quick Start

### 1. Start all services with database

```bash
# Build and start all containers including MySQL
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 2. Check if database is running

```bash
# Check container status
docker-compose ps

# View database logs
docker-compose logs mysql

# Connect to database directly
docker-compose exec mysql mysql -u socteamup_user -p socteamup_db
```

### 3. Test database connection

```bash
# Run database test
cd lambda
node test-db.js
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Auth Logs Table
```sql
CREATE TABLE auth_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action ENUM('login', 'logout', 'register', 'password_reset') NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'in_progress', 'completed', 'spam') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

### Backend Service
```env
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_NAME=socteamup_db
DB_USER=socteamup_user
DB_PASSWORD=socteamup_password

# Other variables...
JWT_SECRET=your-jwt-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### MySQL Service
```env
MYSQL_ROOT_PASSWORD=root_password
MYSQL_DATABASE=socteamup_db
MYSQL_USER=socteamup_user
MYSQL_PASSWORD=socteamup_password
```

## Database Operations

### User Management

```javascript
const { createUser, getUserByEmail, updateUser } = require('./lambda/database');

// Create a new user
const userData = {
  email: 'user@example.com',
  name: 'John Doe',
  google_id: 'google_123',
  avatar_url: 'https://example.com/avatar.jpg'
};
const result = await createUser(userData);

// Get user by email
const user = await getUserByEmail('user@example.com');

// Update user
await updateUser(userId, { name: 'Jane Doe' });
```

### Contact Form Submissions

```javascript
const { saveContactSubmission, getContactSubmissions } = require('./lambda/database');

// Save contact form submission
const submission = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company: 'Example Corp',
  subject: 'Inquiry',
  message: 'Hello, I have a question...'
};
await saveContactSubmission(submission);

// Get recent submissions
const submissions = await getContactSubmissions(10, 0);
```

### Authentication Logging

```javascript
const { logAuthAction } = require('./lambda/database');

// Log authentication action
await logAuthAction({
  user_id: 123,
  action: 'login',
  ip_address: '192.168.1.1',
  user_agent: 'Mozilla/5.0...',
  success: true
});
```

## Data Persistence

The database data is persisted using Docker volumes:

```yaml
volumes:
  mysql_data:
    driver: local
```

This means your data will survive container restarts and rebuilds.

## Backup and Restore

### Backup Database
```bash
# Create backup
docker-compose exec mysql mysqldump -u socteamup_user -p socteamup_db > backup.sql

# Or backup with timestamp
docker-compose exec mysql mysqldump -u socteamup_user -p socteamup_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
# Restore from backup
docker-compose exec -T mysql mysql -u socteamup_user -p socteamup_db < backup.sql
```

## Troubleshooting

### Database Connection Issues

1. **Check if MySQL container is running:**
   ```bash
   docker-compose ps mysql
   ```

2. **View MySQL logs:**
   ```bash
   docker-compose logs mysql
   ```

3. **Test connection manually:**
   ```bash
   docker-compose exec mysql mysql -u socteamup_user -p socteamup_db
   ```

### Reset Database

```bash
# Stop containers
docker-compose down

# Remove volume (WARNING: This will delete all data)
docker volume rm socteamup_mysql_data

# Start fresh
docker-compose up --build
```

### Common Issues

1. **Port 3306 already in use:**
   - Change the port mapping in docker-compose.yml
   - Or stop other MySQL instances

2. **Permission denied:**
   - Check file permissions for database/init.sql
   - Ensure proper ownership

3. **Connection timeout:**
   - Increase connection timeout in database.js
   - Check network connectivity between containers

## Security Considerations

1. **Change default passwords** in production
2. **Use strong passwords** for database users
3. **Limit database access** to only necessary IPs
4. **Regular backups** of important data
5. **Monitor database logs** for suspicious activity

## Production Deployment

For production, consider:

1. **External database** (RDS, Cloud SQL, etc.)
2. **Database clustering** for high availability
3. **Automated backups** with retention policies
4. **Monitoring and alerting** for database health
5. **SSL/TLS encryption** for database connections 