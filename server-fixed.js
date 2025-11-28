const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    'http://localhost:3000', 
    'http://localhost:3002',
    'http://frontend:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Lambda functions after Express setup
let authHandler, contactFormHandler, googleAuthHandler;

try {
  authHandler = require('./lambda/auth');
  contactFormHandler = require('./lambda/contact-form');
  googleAuthHandler = require('./lambda/google-auth');
} catch (error) {
  console.error('Error loading lambda functions:', error);
  process.exit(1);
}

// Helper function to convert Express request to Lambda event
const expressToLambdaEvent = (req) => {
  return {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers,
    queryStringParameters: req.query,
    body: JSON.stringify(req.body),
    isBase64Encoded: false
  };
};

// Helper function to convert Lambda response to Express response
const lambdaToExpressResponse = (res, lambdaResponse) => {
  try {
    const response = JSON.parse(lambdaResponse.body);
    res.status(lambdaResponse.statusCode);

    // Set CORS headers
    Object.keys(lambdaResponse.headers || {}).forEach(header => {
      res.set(header, lambdaResponse.headers[header]);
    });

    res.json(response);
  } catch (error) {
    console.error('Error processing lambda response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Health check route (simple route first)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'SocTeamUp Backend'
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const event = expressToLambdaEvent(req);
    const result = await authHandler.handler(event);
    lambdaToExpressResponse(res, result);
  } catch (error) {
    console.error('Auth register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const event = expressToLambdaEvent(req);
    const result = await authHandler.handler(event);
    lambdaToExpressResponse(res, result);
  } catch (error) {
    console.error('Auth login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google Auth routes
app.get('/api/auth/google/auth-url', async (req, res) => {
  try {
    const event = expressToLambdaEvent(req);
    const result = await googleAuthHandler.handler(event);
    lambdaToExpressResponse(res, result);
  } catch (error) {
    console.error('Google auth URL error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/google/callback', async (req, res) => {
  try {
    const event = expressToLambdaEvent(req);
    const result = await googleAuthHandler.handler(event);
    lambdaToExpressResponse(res, result);
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    const event = expressToLambdaEvent(req);
    const result = await contactFormHandler.handler(event);
    lambdaToExpressResponse(res, result);
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple catch-all for undefined routes (avoid using '*')
app.all('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/google/auth-url',
      'POST /api/auth/google/callback',
      'POST /api/contact',
      'GET  /health'
    ]
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SocTeamUp Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/google/auth-url',
      'POST /api/auth/google/callback',
      'POST /api/contact',
      'GET  /health'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server - Listen on all interfaces (0.0.0.0) instead of localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SocTeamUp Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📡 Server listening on all interfaces (0.0.0.0:${PORT})`);
  console.log('📋 Available endpoints:');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/auth/google/auth-url');
  console.log('   POST /api/auth/google/callback');
  console.log('   POST /api/contact');
  console.log('   GET  /health');
  console.log('   GET  / (API info)');
}); 