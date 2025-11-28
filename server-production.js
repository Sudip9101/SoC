const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

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
  queueLimit: 0,
  connectTimeout: 10000
};

// Email configuration (optional - configure these via environment variables)
const emailConfig = {
  enabled: process.env.SMTP_ENABLED === 'true',
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  from: process.env.SMTP_FROM || 'noreply@socteamup.com',
  to: process.env.SMTP_TO || 'contact@socteamup.com'
};

// Create email transporter (only if SMTP is enabled)
let emailTransporter = null;
if (emailConfig.enabled && emailConfig.auth.user && emailConfig.auth.pass) {
  try {
    emailTransporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth
    });
    console.log('Email transporter configured');
  } catch (error) {
    console.error('Failed to configure email transporter:', error.message);
  }
}

// Create connection pool
let pool = null;
let dbConnected = false;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// Test database connection with retry logic
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
      console.error(`Database connection failed (attempt ${retries}/${maxRetries}):`, error.message);
      
      if (retries < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error('Failed to connect to database after maximum retries');
        console.log('Server will start without database connection');
        dbConnected = false;
        return false;
      }
    }
  }
  return false;
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
    server: 'SocTeamUp Backend (Production with Email)',
    database: dbConnected ? 'connected' : 'disconnected',
    email: emailTransporter ? 'enabled' : 'disabled'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SocTeamUp Backend API',
    version: '2.1.0',
    status: 'running',
    database: dbConnected ? 'connected' : 'disconnected',
    email: emailTransporter ? 'enabled' : 'disabled',
    features: ['MySQL Database', 'Authentication', 'Contact Forms', 'Email Notifications', 'Admin Logs'],
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
  if (!dbConnected) throw new Error('Database not connected');
  
  const pool = getPool();
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
  if (!dbConnected) throw new Error('Database not connected');
  
  const pool = getPool();
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
  if (!dbConnected) return; // Silent fail for logging
  
  const pool = getPool();
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
  if (!dbConnected) {
    console.log('Database offline - contact form not saved to DB');
    return { success: true, submissionId: null, savedToDb: false };
  }
  
  const pool = getPool();
  const { name, email, subject, message } = submissionData;
  const phone = submissionData.phone || null;
  const company = submissionData.company || null;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO contact_submissions (name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, company, subject, message]
    );
    console.log(`Contact submission saved to database (ID: ${result.insertId})`);
    return { success: true, submissionId: result.insertId, savedToDb: true };
  } catch (error) {
    console.error('Database error in saveContactSubmission:', error);
    throw error;
  }
};

// Send email notification
const sendContactEmail = async (submissionData) => {
  if (!emailTransporter) {
    console.log('Email disabled - skipping email notification');
    return { success: false, reason: 'Email not configured' };
  }

  const { name, email, subject, message, phone, company } = submissionData;

  try {
    // Email to admin/team
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
    console.log(`Contact email sent to ${emailConfig.to}`);

    // Auto-reply to user
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
        <hr>
        <p><small>This is an automated response. Please do not reply to this email.</small></p>
      `
    };

    await emailTransporter.sendMail(autoReplyOptions);
    console.log(`Auto-reply sent to ${email}`);

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return { success: false, reason: error.message };
  }
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, phone, company } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'All required fields must be provided' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a valid email address' 
      });
    }

    // Save to database
    const dbResult = await saveContactSubmission({ name, email, phone, company, subject, message });
    
    // Send email (non-blocking - don't fail if email fails)
    let emailSent = false;
    try {
      const emailResult = await sendContactEmail({ name, email, phone, company, subject, message });
      emailSent = emailResult.success;
    } catch (emailError) {
      console.error('Email error (non-critical):', emailError.message);
      // Don't fail the request if email fails
    }

    res.json({ 
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon!',
      submissionId: dbResult.submissionId,
      savedToDatabase: dbResult.savedToDb,
      emailSent: emailSent
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false,
      error: 'An error occurred while processing your request' 
    });
  }
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const { ip, userAgent } = getClientInfo(req);

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    if (!dbConnected) {
      return res.status(503).json({ 
        success: false,
        error: 'Database service unavailable. Please try again later.' 
      });
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await logAuthAction({
        user_id: existingUser.id,
        action: 'registration_attempt_duplicate',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      
      return res.status(400).json({ 
        success: false,
        error: 'User already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await createUser({ email, name, password_hash });
    
    if (result.success) {
      await logAuthAction({
        user_id: result.userId,
        action: 'registration',
        ip_address: ip,
        user_agent: userAgent,
        success: true
      });

      res.json({
        success: true,
        message: 'Registration successful',
        user: { id: result.userId, email, name }
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during registration'
    });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { ip, userAgent } = getClientInfo(req);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    if (!dbConnected) {
      return res.status(503).json({ 
        success: false,
        error: 'Database service unavailable. Please try again later.' 
      });
    }

    // Get user
    const user = await getUserByEmail(email);
    
    if (!user) {
      await logAuthAction({
        user_id: null,
        action: 'login_attempt_no_user',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      await logAuthAction({
        user_id: user.id,
        action: 'login_attempt_wrong_password',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Log successful login
    await logAuthAction({
      user_id: user.id,
      action: 'login',
      ip_address: ip,
      user_agent: userAgent,
      success: true
    });

    // Return user data (excluding password)
    const { password_hash, ...userData } = user;
    res.json({
      success: true,
      message: 'Login successful',
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login'
    });
  }
});

// Admin endpoint to get auth logs
app.get('/api/admin/auth-logs', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ 
        success: false,
        error: 'Database service unavailable' 
      });
    }

    const pool = getPool();
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const [logs] = await pool.execute(
      `SELECT al.*, u.email, u.name 
       FROM auth_logs al 
       LEFT JOIN users u ON al.user_id = u.id 
       ORDER BY al.timestamp DESC 
       LIMIT ${limit} OFFSET ${offset}`
    );

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Error fetching auth logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch auth logs'
    });
  }
});

// Start server and test database connection
const startServer = async () => {
  console.log('Starting SocTeamUp Backend Server (Production with Email)...');
  console.log('');
  
  // Test database connection (with retries)
  await testConnection();
  
  // Start Express server regardless of database status
  app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('Server started successfully!');
    console.log(`Listening on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Database: ${dbConnected ? 'Connected' : 'Disconnected (will retry)'}`);
    console.log(`Email: ${emailTransporter ? 'Enabled' : 'Disabled (configure SMTP to enable)'}`);
    console.log('');
  });
  
  if (!dbConnected) {
    console.log('Will continue attempting database connection in background...');
    setInterval(async () => {
      if (!dbConnected) {
        console.log('Attempting database reconnection...');
        await testConnection(1, 0);
      }
    }, 30000); // Retry every 30 seconds
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Start the server
startServer();


