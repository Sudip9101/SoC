# SoCTeamUp Backend Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Design](#architecture-design)
4. [Backend Functionality](#backend-functionality)
5. [Frontend-Backend Integration](#frontend-backend-integration)
6. [Database Architecture](#database-architecture)
7. [Email System Setup](#email-system-setup)
8. [API Endpoints](#api-endpoints)
9. [Deployment Guide](#deployment-guide)
10. [Environment Configuration](#environment-configuration)

---

## Overview

SoCTeamUp is a full-stack web application built with a **Next.js frontend** and **Express.js backend**, utilizing **MySQL** for data persistence and **Nodemailer** for email notifications. The application supports user authentication, contact form submissions, and admin dashboard functionality.

### Key Features
- User registration and authentication with bcrypt password hashing
- Role-based access control (User/Admin)
- Contact form with email notifications
- Authentication activity logging
- MySQL database integration with connection pooling
- SMTP email integration using Nodemailer
- RESTful API architecture
- Docker containerization support

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM/Query Builder**: mysql2/promise (with connection pooling)
- **Authentication**: bcryptjs (password hashing)
- **Email**: Nodemailer (SMTP)
- **CORS**: cors middleware

### Frontend
- **Framework**: Next.js 15.3.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState, useEffect)

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (optional)
- **Version Control**: Git

---

## Architecture Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Browser  │  │   Mobile   │  │   Tablet   │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                    │
│        └────────────────┴────────────────┘                    │
│                         │                                     │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (Next.js)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages (app/)                                         │  │
│  │  ├── /login          ├── /dashboard                  │  │
│  │  ├── /contact        ├── /admin                      │  │
│  │  └── /api/*         (API Routes - Proxy Layer)       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                    HTTP/REST API                             │
└─────────────────────────┼──────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Layer (Express.js - Port 3001)          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Server (server-production.js)                    │  │
│  │  ├── Middleware (CORS, Body Parser)                  │  │
│  │  ├── Route Handlers                                   │  │
│  │  │   ├── /api/auth/register                          │  │
│  │  │   ├── /api/auth/login                             │  │
│  │  │   ├── /api/contact                                │  │
│  │  │   └── /api/admin/auth-logs                        │  │
│  │  └── Connection Pool Manager                          │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                              │                   │
│           ▼                              ▼                   │
│  ┌────────────────┐           ┌────────────────┐           │
│  │  MySQL Driver  │           │   Nodemailer   │           │
│  │  (mysql2)      │           │   Transporter  │           │
│  └────────┬───────┘           └────────┬───────┘           │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            ▼                              ▼
┌───────────────────────┐      ┌──────────────────────┐
│  MySQL Database       │      │   SMTP Server        │
│  (Port 3306)          │      │   (Gmail/Custom)     │
│  ┌─────────────────┐ │      │   Port 587/465       │
│  │ Tables:         │ │      └──────────────────────┘
│  │ - users         │ │
│  │ - auth_logs     │ │
│  │ - contact_sub.. │ │
│  └─────────────────┘ │
└───────────────────────┘
```

### Request Flow

1. **Client Request** → User interacts with Next.js frontend
2. **Frontend API Route** → Next.js API route receives request
3. **Backend Server** → Express.js processes the request
4. **Database Query** → MySQL executes query via connection pool
5. **Response** → Data flows back through the layers
6. **Email (if applicable)** → Nodemailer sends notifications

---

## Backend Functionality

### Core Components

#### 1. **Express Server (`server-production.js`)**

The main backend server handles:
- HTTP request routing
- Middleware processing
- Database connection management
- Email service integration
- Error handling

```javascript
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

#### 2. **Database Connection Pool**

Uses MySQL connection pooling for efficient database operations:

```javascript
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'socteamup_user',
  password: process.env.DB_PASSWORD || 'socteamup_password',
  database: process.env.DB_NAME || 'socteamup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
};

const pool = mysql.createPool(dbConfig);
```

**Benefits:**
- Reuses connections instead of creating new ones
- Handles up to 10 concurrent connections
- Automatic connection management
- Retry logic for failed connections

#### 3. **Authentication System**

**Password Hashing:**
```javascript
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const password_hash = await bcrypt.hash(password, saltRounds);
```

**Password Verification:**
```javascript
const isValidPassword = await bcrypt.compare(password, user.password_hash);
```

**Security Features:**
- Bcrypt hashing with salt rounds (10)
- No plain-text passwords stored
- IP address and user agent logging
- Failed login attempt tracking

#### 4. **Email Service (Nodemailer)**

Configured for SMTP email delivery:

```javascript
const emailConfig = {
  enabled: process.env.SMTP_ENABLED === 'true',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  from: process.env.SMTP_FROM || 'noreply@socteamup.com',
  to: process.env.SMTP_TO || 'contact@socteamup.com'
};

const emailTransporter = nodemailer.createTransport(emailConfig);
```

---

## Frontend-Backend Integration

### Communication Architecture

The frontend and backend communicate via **RESTful API** calls using the **Fetch API**.

### Next.js API Routes (Proxy Layer)

Located in `src/app/api/`, these routes act as intermediaries:

```
Frontend Component
      ↓
Next.js API Route (/api/auth/login)
      ↓
Express Backend (http://localhost:3001/api/auth/login)
      ↓
MySQL Database
```

### Example: Login Flow

**1. Frontend Component (`src/app/login/page.tsx`)**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  if (result.success) {
    localStorage.setItem('authToken', result.token);
    window.location.href = '/dashboard';
  }
};
```

**2. Next.js API Route (`src/app/api/auth/login/route.ts`)**

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;
  
  // Validate input
  const user = await getUserByEmail(email);
  const isValid = await bcrypt.compare(password, user.password_hash);
  
  if (isValid) {
    return NextResponse.json({
      success: true,
      token: mockToken,
      user: userData
    });
  }
}
```

**3. Database Query (`src/lib/database.ts`)**

```typescript
export const getUserByEmail = async (email: string) => {
  const pool = await getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
};
```

### CORS Configuration

Backend allows cross-origin requests from frontend:

```javascript
const allowedOrigins = [
  'http://localhost:3000',      // Next.js dev server
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://frontend:3000',       // Docker container
  process.env.FRONTEND_URL      // Production URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
```

---

## Database Architecture

### MySQL Database Schema

#### **1. Users Table**

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255),
  avatar_url VARCHAR(500),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_google_id (google_id)
);
```

**Fields:**
- `id`: Primary key, auto-increment
- `email`: Unique identifier for users
- `password_hash`: Bcrypt hashed password (60 characters)
- `google_id`: For OAuth authentication
- `role`: User access level (user/admin)
- `is_active`: Account status flag

#### **2. Auth Logs Table**

```sql
CREATE TABLE auth_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

**Logged Actions:**
- `registration`
- `login`
- `login_attempt_wrong_password`
- `login_attempt_no_user`
- `google_oauth_login`

#### **3. Contact Submissions Table**

```sql
CREATE TABLE contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status)
);
```

### Database Connection Management

**Connection Pool Benefits:**
- Reuses existing connections
- Reduces connection overhead
- Handles concurrent requests efficiently
- Automatic reconnection on failure

**Retry Logic:**

```javascript
const testConnection = async (maxRetries = 10, retryDelay = 5000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const connection = await getPool().getConnection();
      console.log('Database connected successfully');
      connection.release();
      dbConnected = true;
      return true;
    } catch (error) {
      retries++;
      console.error(`Database connection failed (attempt ${retries}/${maxRetries})`);
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  return false;
};
```

**Features:**
- Attempts connection 10 times with 5-second delays
- Server starts even if database is unavailable
- Background reconnection every 30 seconds
- Graceful degradation for DB operations

---

## Email System Setup

### Nodemailer Configuration

#### **1. SMTP Setup for Gmail**

To use Gmail as your SMTP server:

**Step 1: Enable 2-Factor Authentication**
1. Go to Google Account → Security
2. Enable 2-Step Verification

**Step 2: Generate App Password**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "SoCTeamUp Backend"
4. Copy the 16-character password

**Step 3: Configure Environment Variables**

```bash
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=noreply@socteamup.com
SMTP_TO=contact@socteamup.com
```

#### **2. Email Transporter Initialization**

```javascript
let emailTransporter = null;
if (emailConfig.enabled && emailConfig.auth.user && emailConfig.auth.pass) {
  try {
    emailTransporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,  // true for 465, false for 587
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass
      }
    });
    console.log('Email transporter configured');
  } catch (error) {
    console.error('Failed to configure email transporter:', error.message);
  }
}
```

#### **3. Sending Contact Form Emails**

**Admin Notification Email:**

```javascript
const sendContactEmail = async (submissionData) => {
  const { name, email, subject, message, phone, company } = submissionData;
  
  // Email to admin
  const adminMailOptions = {
    from: emailConfig.from,
    to: emailConfig.to,
    subject: `New Contact Form: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Received: ${new Date().toLocaleString()}</small></p>
    `
  };
  
  await emailTransporter.sendMail(adminMailOptions);
};
```

**Auto-Reply to User:**

```javascript
const autoReplyOptions = {
  from: emailConfig.from,
  to: email,
  subject: 'Thank you for contacting SoCTeamUp',
  html: `
    <h2>Thank you for reaching out!</h2>
    <p>Dear ${name},</p>
    <p>We have received your message and will get back to you as soon as possible.</p>
    <p><strong>Your message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <br>
    <p>Best regards,<br>SoCTeamUp Team</p>
  `
};

await emailTransporter.sendMail(autoReplyOptions);
```

#### **4. Alternative SMTP Providers**

**SendGrid:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**AWS SES:**
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

**Custom SMTP Server:**
```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
```

---

## API Endpoints

### Authentication Endpoints

#### **POST /api/auth/register**

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "mock_jwt_123456",
  "user": {
    "userId": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "User already exists"
}
```

---

#### **POST /api/auth/login**

Authenticate user and receive token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "mock_jwt_123456",
  "user": {
    "userId": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### Contact Endpoints

#### **POST /api/contact**

Submit contact form.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "subject": "Partnership Inquiry",
  "message": "I would like to discuss potential partnership opportunities."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Thank you for contacting us. We will get back to you soon!",
  "submissionId": 42,
  "savedToDatabase": true,
  "emailSent": true
}
```

---

### Admin Endpoints

#### **GET /api/admin/auth-logs**

Retrieve authentication logs (Admin only).

**Query Parameters:**
- `limit` (optional): Number of records (default: 50)
- `offset` (optional): Starting position (default: 0)

**Response (Success - 200):**
```json
{
  "success": true,
  "logs": [
    {
      "id": 1,
      "user_id": 5,
      "email": "user@example.com",
      "name": "John Doe",
      "action": "login",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "success": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Health Check

#### **GET /health**

Server and database health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "server": "SocTeamUp Backend (Production with Email)",
  "database": "connected",
  "email": "enabled"
}
```

---

## Deployment Guide

### Docker Deployment

#### **1. Docker Compose Configuration**

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: socteamup_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: socteamup_db
      MYSQL_USER: socteamup_user
      MYSQL_PASSWORD: socteamup_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend-production
    container_name: socteamup_backend
    restart: always
    ports:
      - "3001:3001"
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: socteamup_user
      DB_PASSWORD: socteamup_password
      DB_NAME: socteamup_db
      SMTP_ENABLED: "true"
      SMTP_HOST: smtp.gmail.com
      SMTP_PORT: 587
      SMTP_USER: your-email@gmail.com
      SMTP_PASS: your-app-password
      SMTP_FROM: noreply@socteamup.com
      SMTP_TO: contact@socteamup.com

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend-production
    container_name: socteamup_frontend
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001

volumes:
  mysql_data:
```

#### **2. Build and Run**

```bash
# Build containers
docker-compose build --no-cache

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

### Manual Deployment

#### **1. Install Dependencies**

```bash
# Backend dependencies
npm install express cors bcryptjs mysql2 nodemailer

# Frontend dependencies
cd src && npm install
```

#### **2. Configure Environment**

Create `.env` file:

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=socteamup_user
DB_PASSWORD=socteamup_password
DB_NAME=socteamup_db

# Email
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@socteamup.com
SMTP_TO=contact@socteamup.com

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
```

#### **3. Initialize Database**

```bash
mysql -u root -p < database/init.sql
```

#### **4. Start Services**

```bash
# Backend (Terminal 1)
node server-production.js

# Frontend (Terminal 2)
cd src && npm run dev
```

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL host | mysql | Yes |
| `DB_PORT` | MySQL port | 3306 | Yes |
| `DB_USER` | MySQL username | socteamup_user | Yes |
| `DB_PASSWORD` | MySQL password | socteamup_password | Yes |
| `DB_NAME` | Database name | socteamup_db | Yes |
| `SMTP_ENABLED` | Enable email | false | No |
| `SMTP_HOST` | SMTP server | smtp.gmail.com | If email enabled |
| `SMTP_PORT` | SMTP port | 587 | If email enabled |
| `SMTP_USER` | SMTP username | - | If email enabled |
| `SMTP_PASS` | SMTP password | - | If email enabled |
| `SMTP_FROM` | From address | noreply@socteamup.com | No |
| `SMTP_TO` | Admin email | contact@socteamup.com | No |
| `PORT` | Backend port | 3001 | No |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 | No |

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong database passwords** (minimum 16 characters)
3. **Use Gmail App Passwords**, not regular passwords
4. **Enable HTTPS** in production
5. **Implement rate limiting** for API endpoints
6. **Use JWT tokens** instead of mock tokens in production
7. **Sanitize user inputs** to prevent SQL injection
8. **Keep dependencies updated** regularly

---

## Troubleshooting

### Database Connection Issues

**Problem:** `Database connection failed`

**Solution:**
```bash
# Check MySQL is running
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Test connection manually
mysql -h localhost -u socteamup_user -p socteamup_db
```

### Email Not Sending

**Problem:** Email transporter fails

**Solutions:**
1. Verify Gmail App Password is correct
2. Check SMTP settings are correct
3. Ensure 2FA is enabled on Gmail
4. Check firewall allows port 587
5. Review backend logs for specific errors

### CORS Errors

**Problem:** `Blocked by CORS policy`

**Solution:**
```javascript
// Add your frontend URL to allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://yourdomain.com'
];
```

---

## Performance Optimization

### Database Optimization

1. **Use Connection Pooling** (Already implemented)
2. **Add Database Indexes**:
   ```sql
   CREATE INDEX idx_email ON users(email);
   CREATE INDEX idx_created_at ON auth_logs(created_at);
   ```
3. **Implement Caching** (Redis recommended)
4. **Use Prepared Statements** (Already implemented)

### Backend Optimization

1. **Enable Gzip Compression**
2. **Implement Rate Limiting**
3. **Use PM2 for Process Management**
4. **Enable Clustering** for multi-core utilization

---

## Support & Contact

- **Email**: contact@socteamup.com
- **Website**: https://socteamup.com
- **GitHub**: https://github.com/Sudip9101/SoC

---

## License

© 2024 SoCTeamUp. All rights reserved.

---

**Built with ❤️ by the SoCTeamUp Development Team**

