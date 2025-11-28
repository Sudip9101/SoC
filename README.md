# SocTeamUp Website

A modern, responsive website for SocTeamUp - an integrated circuit design and consulting company.

## 🚀 Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **User Authentication**: Login system with role-based access control
- **User Dashboard**: Personalized dashboard for regular users
- **Admin Dashboard**: Comprehensive admin panel with real-time metrics
- **Developer Section**: Resources and documentation for developers
- **Contact System**: Contact form with backend integration
- **Settings Management**: User profile and preferences management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **Authentication**: bcryptjs
- **Email**: Nodemailer (SMTP)
- **Containerization**: Docker & Docker Compose

### Deployment
- **Frontend**: Vercel, Netlify, or AWS
- **Backend**: Docker, AWS EC2, or any Node.js hosting
- **Database**: MySQL (Docker or cloud-hosted)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (for backend)
- MySQL 8.0 (or use Docker)

### Installation

#### Option 1: Docker (Recommended - Full Stack)

1. Clone the repository:
```bash
git clone https://github.com/Sudip9101/SoC.git
cd SoC
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - MySQL: localhost:3306

#### Option 2: Manual Setup (Development)

1. Clone the repository:
```bash
git clone https://github.com/Sudip9101/SoC.git
cd SoC
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL database:
```bash
mysql -u root -p < database/init.sql
```

4. Configure environment variables (create `.env` file):
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=socteamup_user
DB_PASSWORD=socteamup_password
DB_NAME=socteamup_db
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

5. Start backend server:
```bash
node server-production.js
```

6. Start frontend (in another terminal):
```bash
npm run dev
```

7. Open http://localhost:3000 in your browser

### 📚 Detailed Documentation

For comprehensive backend architecture, database schema, email setup, and API documentation, see:
**[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)**

## 🔐 Demo Credentials

### Regular User
- **Email**: demo@socteamup.com
- **Password**: password123

### Admin User
- **Email**: admin@socteamup.com
- **Password**: admin123456

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- **Mobile**: 375px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px+

## 🏗️ Project Structure

```
SoC/
├── src/                       # Frontend source code
│   ├── app/                   # Next.js app directory
│   │   ├── about/            # About page
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # Next.js API routes (proxy layer)
│   │   ├── contact/          # Contact page
│   │   ├── dashboard/        # User dashboard
│   │   ├── developers/       # Developer resources
│   │   ├── login/            # Login page
│   │   └── settings/         # Settings page
│   ├── components/           # Reusable React components
│   │   └── layout/          # Layout components (Navbar, Footer)
│   └── lib/                 # Utility functions & database helpers
│       ├── database.ts      # Database connection & queries
│       ├── blog-content.ts  # Blog content management
│       └── auth-store.ts    # Authentication state
├── public/                  # Static assets (images, videos)
├── database/                # Database schema & initialization
│   └── init.sql            # MySQL database setup
├── lambda/                  # AWS Lambda functions (optional)
├── content/                 # Developer documentation
├── server-production.js     # Express.js backend server
├── docker-compose.yml       # Docker orchestration
├── Dockerfile.backend       # Backend container config
├── Dockerfile.frontend      # Frontend container config
├── BACKEND_ARCHITECTURE.md  # Complete backend documentation
└── package.json            # Project dependencies
```

## 🌟 Key Features

### Authentication System
- **User Registration**: Secure signup with bcrypt password hashing
- **User Login**: Email/password authentication
- **Role-based Access Control**: User and Admin roles
- **Activity Logging**: Track all authentication events with IP and user agent
- **Password Security**: 10-round bcrypt hashing with salt

### Database Integration
- **MySQL 8.0**: Production-grade relational database
- **Connection Pooling**: Efficient connection management (10 concurrent connections)
- **Automatic Retry**: 10 retry attempts with 5-second delays
- **Graceful Degradation**: Server continues running even if DB is down
- **Real-time Monitoring**: Health checks and status endpoints

### Email System
- **Nodemailer Integration**: SMTP email delivery
- **Contact Form Notifications**: Admin email alerts for new submissions
- **Auto-reply**: Automatic confirmation emails to users
- **Gmail Support**: Easy setup with Gmail App Passwords
- **Custom SMTP**: Support for SendGrid, AWS SES, or custom servers

### User Dashboard
- Welcome section with user info
- Quick action cards
- Recent activity tracking
- Profile information display

### Admin Dashboard
- Real-time metrics and analytics
- User management capabilities
- Authentication logs viewer
- Contact form submissions
- System monitoring

### API Architecture
- **RESTful API**: Clean endpoint structure
- **CORS Support**: Flexible cross-origin configuration
- **Error Handling**: Comprehensive error responses
- **Request Validation**: Input sanitization and validation
- **Health Checks**: System status monitoring

### Developer Resources
- Comprehensive API documentation
- Downloadable tools and SDKs
- Code examples and tutorials
- Version-controlled content

## 🚀 Deployment

### Docker Deployment (Recommended)

Deploy the entire stack with one command:

```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
```

**Services:**
- MySQL: localhost:3306
- Backend: localhost:3001
- Frontend: localhost:3000

### Frontend Deployment

#### Vercel (Recommended for Frontend)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
4. Deploy automatically

#### Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Set environment variables

### Backend Deployment

#### Docker on AWS EC2 / DigitalOcean / Any VPS
```bash
# Clone repository
git clone https://github.com/Sudip9101/SoC.git
cd SoC

# Configure environment variables
nano .env

# Start services
docker-compose -f docker-compose-production.yml up -d
```

#### Manual Node.js Deployment
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env

# Start with PM2 (process manager)
npm install -g pm2
pm2 start server-production.js --name socteamup-backend
pm2 save
pm2 startup
```

### Database Setup

**Option 1: Docker (Included in docker-compose)**
- Automatically initialized with `database/init.sql`

**Option 2: External MySQL Server**
```bash
mysql -u root -p < database/init.sql
```

**Option 3: Cloud Database**
- AWS RDS MySQL
- Google Cloud SQL
- DigitalOcean Managed Database

Update connection settings in `.env` file.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DB_HOST=mysql                        # Use 'localhost' for local, 'mysql' for Docker
DB_PORT=3306
DB_USER=socteamup_user
DB_PASSWORD=socteamup_password       # Change in production!
DB_NAME=socteamup_db

# Email Configuration (Optional but recommended)
SMTP_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false                    # true for port 465, false for 587
SMTP_USER=your-email@gmail.com       # Your Gmail address
SMTP_PASS=your-app-password          # Gmail App Password (16 chars)
SMTP_FROM=noreply@socteamup.com
SMTP_TO=contact@socteamup.com        # Admin email for notifications

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000   # Update for production

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
```

### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Enter "SoCTeamUp Backend"
5. Copy the 16-character password
6. Use it as `SMTP_PASS` in your `.env` file

### Build Configuration

The project uses:
- **Next.js 15** with TypeScript for type safety
- **Tailwind CSS** for styling
- **ESLint** for code quality
- **Express.js** for backend API
- **MySQL2** for database queries
- **Nodemailer** for email delivery

## 📚 Additional Documentation

- **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - Complete backend documentation
  - System architecture and design patterns
  - Database schema and relationships
  - Email system configuration
  - API endpoint specifications
  - Deployment guides
  - Troubleshooting tips

## 📞 Support

- **Website**: [https://socteamup.com](https://socteamup.com)
- **Email**: contact@socteamup.com
- **GitHub**: [https://github.com/Sudip9101/SoC](https://github.com/Sudip9101/SoC)
- **Developer Docs**: Available in `/developers` section

## 📄 License

© 2024 SocTeamUp. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with ❤️ by the SocTeamUp team**
