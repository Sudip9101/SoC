const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'socteamup_user',
  password: process.env.DB_PASSWORD || 'socteamup_password',
  database: process.env.DB_NAME || 'socteamup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
let pool = null;

const getPool = async () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Test database connection
const testConnection = async () => {
  try {
    const connection = await (await getPool()).getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Middleware - Flexible CORS for different deployment scenarios
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://frontend:3000',
];

// Add custom frontend URL if specified
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any origin from the same host (for production flexibility)
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.hostname;
      
      // Allow same host with different ports (production scenario)
      if (originHost && (originHost === 'localhost' || originHost === '127.0.0.1' || !originHost.includes('localhost'))) {
        return callback(null, true);
      }
    } catch (e) {
      // Invalid URL, reject
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Extract client IP and user agent
const getClientInfo = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : 
            req.headers['x-real-ip'] || 
            req.connection.remoteAddress || 
            '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  return { ip, userAgent };
};

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'SocTeamUp Backend (Production)',
    database: pool ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SocTeamUp Backend API',
    version: '2.0.0',
    status: 'running',
    features: ['MySQL Database', 'Authentication', 'Contact Forms', 'Admin Logs'],
    endpoints: [
      'GET  /health',
      'GET  /',
      'POST /api/contact',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/admin/auth-logs'
    ]
  });
});

// Database helper functions
const createUser = async (userData) => {
  const pool = await getPool();
  const { email, name, password_hash } = userData;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
      [email, name, password_hash]
    );
    return { success: true, userId: result.insertId };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'User already exists' };
    }
    throw error;
  }
};

const getUserByEmail = async (email) => {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

const logAuthAction = async (logData) => {
  const pool = await getPool();
  const { user_id, action, ip_address, user_agent, success } = logData;
  
  try {
    await pool.execute(
      'INSERT INTO auth_logs (user_id, action, ip_address, user_agent, success) VALUES (?, ?, ?, ?, ?)',
      [user_id, action, ip_address, user_agent, success]
    );
  } catch (error) {
    console.error('Failed to log auth action:', error);
  }
};

const saveContactSubmission = async (submissionData) => {
  const pool = await getPool();
  const { name, email, subject, message } = submissionData;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    return { success: true, submissionId: result.insertId };
  } catch (error) {
    console.error('Database error in saveContactSubmission:', error);
    throw error;
  }
};

// Input validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 5;
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a valid email address' 
      });
    }

    // Save to database
    const result = await saveContactSubmission({ name, email, subject, message });

    console.log('📧 Contact form submission saved to database:', {
      submissionId: result.submissionId,
      name,
      email,
      subject,
      timestamp: new Date().toISOString()
    });

    // Return success response
    res.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      submissionId: result.submissionId
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const { ip, userAgent } = getClientInfo(req);
  
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validation
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || !validatePassword(password)) {
      errors.push('Password must be at least 5 characters long');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log('❌ Registration failed: User already exists for email:', email);
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email address'
      });
    }

    // Hash the password securely
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    const result = await createUser({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password_hash
    });

    if (!result.success) {
      console.log('❌ Registration failed: Database error:', result.error);
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to create user'
      });
    }

    // Log successful registration
    await logAuthAction({
      user_id: result.userId,
      action: 'register',
      ip_address: ip,
      user_agent: userAgent,
      success: true
    });

    console.log('✅ User registration successful (Database):', {
      userId: result.userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      timestamp: new Date().toISOString(),
    });

    // Generate JWT token (in production, use proper JWT library)
    const mockToken = `mock_jwt_${result.userId}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now log in.',
      token: mockToken,
      user: {
        userId: result.userId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role: 'user',
        createdAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error processing registration:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { ip, userAgent } = getClientInfo(req);
  
  try {
    const { email, password } = req.body;

    // Basic validation
    const errors = [];

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 5) {
      errors.push('Password must be at least 5 characters long');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Get user from database
    const user = await getUserByEmail(email);
    
    if (!user) {
      console.log('❌ Login failed: User not found for email:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      console.log('❌ Login failed: User account is inactive for email:', email);
      // Log failed login attempt
      await logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      return res.status(401).json({
        success: false,
        error: 'Account is inactive. Please contact administrator.'
      });
    }

    // Verify password using bcrypt
    console.log('🔍 Password verification for user:', email);
    
    if (!user.password_hash) {
      console.log('❌ Login failed: No password hash found for user');
      await logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      console.log('❌ Password verification failed for user:', email);
      // Log failed login attempt
      await logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    console.log('✅ Password verification successful for user:', email);

    // Log successful login and update last login time
    await Promise.all([
      logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: true
      })
    ]);

    console.log('✅ User login successful (Database):', {
      userId: user.id,
      email: user.email,
      name: user.name,
      timestamp: new Date().toISOString(),
    });

    // Generate JWT token (in production, use proper JWT library)
    const mockToken = `mock_jwt_${user.id}_${Date.now()}`;

    res.json({
      success: true,
      message: 'Login successful!',
      token: mockToken,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        lastLogin: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error processing login:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Admin authentication logs endpoint
app.get('/api/admin/auth-logs', async (req, res) => {
  try {
    const pool = await getPool();
    
    // Get authentication logs
    const [logs] = await pool.execute(`
      SELECT al.*, u.email, u.name 
      FROM auth_logs al 
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC 
      LIMIT 50
    `);
    
    // Get user statistics
    const [totalUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [activeUsers] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');
    const [recentRegistrations] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    // Calculate today's activities
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = logs.filter(log => 
      new Date(log.created_at) >= today
    );
    
    const todayLogins = todayLogs.filter(log => 
      log.action === 'login' && log.success
    ).length;
    
    const todayRegistrations = todayLogs.filter(log => 
      log.action === 'register' && log.success
    ).length;

    res.json({
      success: true,
      data: {
        logs,
        stats: {
          totalUsers: totalUsers[0].count,
          activeUsers: activeUsers[0].count,
          recentRegistrations: recentRegistrations[0].count,
          todayLogins,
          todayRegistrations
        },
        pagination: {
          limit: 50,
          offset: 0,
          hasMore: logs.length === 50
        }
      }
    });

  } catch (error) {
    console.error('Error fetching auth logs:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch authentication logs'
    });
  }
});

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET  /health',
      'GET  /',
      'POST /api/contact',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/admin/auth-logs'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize database and start server
const startServer = async () => {
  console.log('🚀 Starting SocTeamUp Backend Server (Production)...');
  
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Server not starting.');
    process.exit(1);
  }

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SocTeamUp Backend Server (Production) running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`💾 Database: MySQL connected successfully`);
    
    // Show frontend URL configuration
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl) {
      console.log(`🔗 Frontend URL: ${frontendUrl}`);
    } else {
      console.log(`🔗 Frontend URLs: Multiple origins allowed (localhost:3000, frontend:3000, etc.)`);
    }
    
    console.log(`📡 Server listening on all interfaces (0.0.0.0:${PORT})`);
    console.log(`🌐 Accessible via: http://localhost:${PORT} | http://[your-server-ip]:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  / (API info)');
    console.log('   GET  /health');
    console.log('   POST /api/contact (with MySQL storage)');
    console.log('   POST /api/auth/register (with MySQL storage)');
    console.log('   POST /api/auth/login (with MySQL authentication)');
    console.log('   GET  /api/admin/auth-logs (admin dashboard data)');
  });
};

startServer(); 