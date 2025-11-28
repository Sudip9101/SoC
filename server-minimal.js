const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Flexible CORS for different deployment scenarios
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002', 
  'http://127.0.0.1:3000',
  'http://frontend:3000',
  // Allow any origin on the same host (for production deployments)
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

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'SocTeamUp Backend (Minimal)'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SocTeamUp Backend API',
    version: '1.0.0',
    status: 'running',
    note: 'Minimal version without lambda functions',
    endpoints: [
      'GET  /health',
      'GET  /',
      'POST /api/contact (basic)'
    ]
  });
});

// Basic contact form route (without lambda function)
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide a valid email address' 
      });
    }

    // Log the submission (in real app, you'd save to database)
    console.log('📧 Contact form submission received:');
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message: ${message}`);
    console.log(`   Timestamp: ${new Date().toISOString()}`);

    // Return success response
    res.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      submissionId: `sub_${Date.now()}` // Mock ID
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Basic auth endpoints (mocked for now)
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: false,
    message: 'Registration temporarily unavailable - backend lambda functions need debugging'
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: false,
    message: 'Login temporarily unavailable - backend lambda functions need debugging'
  });
});

// Google auth endpoints (mocked for now)
app.get('/api/auth/google/auth-url', (req, res) => {
  res.json({
    success: false,
    message: 'Google auth temporarily unavailable - backend lambda functions need debugging'
  });
});

app.post('/api/auth/google/callback', (req, res) => {
  res.json({
    success: false,
    message: 'Google auth callback temporarily unavailable - backend lambda functions need debugging'
  });
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
      'POST /api/auth/register (temporarily disabled)',
      'POST /api/auth/login (temporarily disabled)',
      'GET  /api/auth/google/auth-url (temporarily disabled)',
      'POST /api/auth/google/callback (temporarily disabled)'
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

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SocTeamUp Backend Server (Minimal) running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Show frontend URL configuration
  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl) {
    console.log(`🔗 Frontend URL: ${frontendUrl}`);
  } else {
    console.log(`🔗 Frontend URLs: Multiple origins allowed (localhost:3000, frontend:3000, etc.)`);
  }
  
  console.log(`📡 Server listening on all interfaces (0.0.0.0:${PORT})`);
  console.log(`🌐 Accessible via: http://localhost:${PORT} | http://[your-server-ip]:${PORT}`);
  console.log(`⚠️  Note: Lambda functions temporarily disabled due to path-to-regexp conflict`);
  console.log('📋 Available endpoints:');
  console.log('   GET  / (API info)');
  console.log('   GET  /health');
  console.log('   POST /api/contact (basic version)');
  console.log('   POST /api/auth/* (mocked responses)');
}); 