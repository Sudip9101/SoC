# Database Testing Guide

This guide provides comprehensive instructions for testing the MySQL database functionality in the SoCTeamup application.

## Prerequisites

1. **Docker Desktop** must be installed and running
2. **Node.js** and **npm** must be installed
3. All project dependencies must be installed

## Quick Database Health Check

### Step 1: Start Docker Containers

```bash
# Start all services including MySQL database
docker-compose up -d

# Check if containers are running
docker-compose ps
```

Expected output should show:
- `frontend` - Running
- `backend` - Running  
- `mysql` - Running
- `nginx` - Running (if using production profile)

### Step 2: Verify Database Container

```bash
# Check MySQL container logs
docker-compose logs mysql

# Connect to database directly
docker-compose exec mysql mysql -u socteamup_user -p socteamup_db
# Password: socteamup_password
```

### Step 3: Run Database Health Check

```bash
# Navigate to lambda directory
cd lambda

# Run health check
node check-db.js
```

Expected output:
```
🔍 Checking database health...

1️⃣ Testing connection...
✅ Database connection successful

2️⃣ Testing basic queries...
✅ Available tables: users, auth_logs, contact_submissions, blog_posts

3️⃣ Checking table records...
   📊 users: 0 records
   📊 auth_logs: 0 records
   📊 contact_submissions: 0 records
   📊 blog_posts: 0 records

4️⃣ Testing user operations...
   ✅ Users table accessible, found 0 users

5️⃣ Testing contact submissions...
   ✅ Contact submissions table accessible, found 0 submissions

🎉 Database health check completed successfully!

📋 Summary:
   - Database: socteamup_db
   - Host: localhost:3306
   - User: socteamup_user
   - Tables: 4
```

## Comprehensive Database Testing

### Step 1: Run Full Test Suite

```bash
# Run comprehensive database test
node test-contact.js
```

This test will:
1. ✅ Test database connection
2. ✅ Create a test user
3. ✅ Retrieve user by email
4. ✅ Retrieve user by ID
5. ✅ Update user information
6. ✅ Log authentication actions
7. ✅ Save contact form submission
8. ✅ Retrieve contact submissions
9. ✅ Update contact submission status
10. ✅ Count records in all tables

### Step 2: Test Individual Components

#### Test Basic Database Connection
```bash
node -e "
const { testConnection } = require('./database');
testConnection().then(result => {
  console.log('Connection result:', result);
});
"
```

#### Test User Management
```bash
node -e "
const { createUser, getUserByEmail } = require('./database');
async function test() {
  const result = await createUser({
    email: 'test@example.com',
    name: 'Test User'
  });
  console.log('Create result:', result);
  
  const user = await getUserByEmail('test@example.com');
  console.log('Retrieved user:', user);
}
test();
"
```

#### Test Contact Form
```bash
node -e "
const { saveContactSubmission, getContactSubmissions } = require('./database');
async function test() {
  const result = await saveContactSubmission({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test',
    message: 'Test message'
  });
  console.log('Save result:', result);
  
  const submissions = await getContactSubmissions();
  console.log('Submissions:', submissions);
}
test();
"
```

## Manual Database Verification

### Connect to MySQL Container

```bash
# Connect to MySQL as root
docker-compose exec mysql mysql -u root -p
# Password: root_password

# Or connect as application user
docker-compose exec mysql mysql -u socteamup_user -p socteamup_db
# Password: socteamup_password
```

### Check Database Structure

```sql
-- Show all databases
SHOW DATABASES;

-- Use the application database
USE socteamup_db;

-- Show all tables
SHOW TABLES;

-- Check table structure
DESCRIBE users;
DESCRIBE auth_logs;
DESCRIBE contact_submissions;
DESCRIBE blog_posts;

-- Check table contents
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM auth_logs;
SELECT COUNT(*) FROM contact_submissions;
SELECT COUNT(*) FROM blog_posts;
```

### Test Data Insertion

```sql
-- Insert test user
INSERT INTO users (email, name, role) 
VALUES ('admin@socteamup.com', 'Admin User', 'admin');

-- Insert test contact submission
INSERT INTO contact_submissions (name, email, subject, message) 
VALUES ('Test User', 'test@example.com', 'Test Subject', 'Test message content');

-- Insert test auth log
INSERT INTO auth_logs (user_id, action, ip_address, success) 
VALUES (1, 'login', '192.168.1.1', true);

-- Verify data
SELECT * FROM users;
SELECT * FROM contact_submissions;
SELECT * FROM auth_logs;
```

## Troubleshooting Common Issues

### Issue 1: Docker Connection Refused

**Symptoms:**
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/containers/json": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

**Solutions:**
1. Start Docker Desktop manually
2. Wait for Docker to fully initialize
3. Restart Docker Desktop if needed

### Issue 2: Database Connection Failed

**Symptoms:**
```
❌ Database connection failed: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**
1. Check if MySQL container is running: `docker-compose ps`
2. Start containers: `docker-compose up -d`
3. Check MySQL logs: `docker-compose logs mysql`
4. Verify database credentials in `docker-compose.yml`

### Issue 3: Authentication Failed

**Symptoms:**
```
❌ Database connection failed: ER_ACCESS_DENIED_ERROR: Access denied for user 'socteamup_user'@'%'
```

**Solutions:**
1. Check database credentials in `docker-compose.yml`
2. Restart containers: `docker-compose down && docker-compose up -d`
3. Reset database volume if needed: `docker volume rm socteamup_mysql_data`

### Issue 4: Database Not Found

**Symptoms:**
```
❌ Database connection failed: ER_BAD_DB_ERROR: Unknown database 'socteamup_db'
```

**Solutions:**
1. Check if initialization script is running: `docker-compose logs mysql`
2. Verify `database/init.sql` file exists
3. Restart containers to re-run initialization

## Performance Testing

### Test Database Performance

```bash
# Test connection pool performance
node -e "
const { getPool } = require('./database');
const pool = getPool();

async function testPerformance() {
  const start = Date.now();
  
  // Test multiple concurrent connections
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(pool.execute('SELECT 1'));
  }
  
  await Promise.all(promises);
  const end = Date.now();
  
  console.log('Performance test completed in', end - start, 'ms');
  pool.end();
}

testPerformance();
"
```

## Security Testing

### Test SQL Injection Prevention

```bash
# Test with malicious input
node -e "
const { saveContactSubmission } = require('./database');

async function testSecurity() {
  try {
    const result = await saveContactSubmission({
      name: 'Test\'; DROP TABLE users; --',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message'
    });
    console.log('Security test passed:', result);
  } catch (error) {
    console.log('Security test failed:', error.message);
  }
}

testSecurity();
"
```

## Monitoring Database Health

### Check Database Status

```bash
# Monitor database logs
docker-compose logs -f mysql

# Check container resource usage
docker stats

# Check database size
docker-compose exec mysql mysql -u socteamup_user -p -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'socteamup_db'
GROUP BY table_schema;
"
```

## Backup and Restore Testing

### Test Database Backup

```bash
# Create backup
docker-compose exec mysql mysqldump -u socteamup_user -p socteamup_db > backup.sql

# Verify backup file
ls -la backup.sql
```

### Test Database Restore

```bash
# Restore from backup
docker-compose exec -T mysql mysql -u socteamup_user -p socteamup_db < backup.sql

# Verify restore
docker-compose exec mysql mysql -u socteamup_user -p -e "SELECT COUNT(*) FROM users;"
```

## Expected Test Results

When all tests pass successfully, you should see:

✅ **Database Connection**: Successful connection to MySQL
✅ **Table Creation**: All 4 tables created (users, auth_logs, contact_submissions, blog_posts)
✅ **User Operations**: Create, read, update user records
✅ **Contact Form**: Save and retrieve contact submissions
✅ **Auth Logging**: Log authentication events
✅ **Data Integrity**: Foreign key constraints working
✅ **Performance**: Fast query execution
✅ **Security**: SQL injection prevention working

## Next Steps

After confirming database functionality:

1. **Test Application Integration**: Verify the backend API connects to database
2. **Test Frontend Forms**: Submit contact forms and verify data storage
3. **Test Authentication**: Register/login users and verify auth logging
4. **Monitor Production**: Set up monitoring for database health in production

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker and MySQL logs
3. Verify all configuration files
4. Test with the provided scripts
5. Reset containers if needed: `docker-compose down -v && docker-compose up -d` 