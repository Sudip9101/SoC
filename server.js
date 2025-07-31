const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Lambda functions
const authHandler = require('./lambda/auth');
const contactFormHandler = require('./lambda/contact-form');
const googleAuthHandler = require('./lambda/google-auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  const response = JSON.parse(lambdaResponse.body);
  res.status(lambdaResponse.statusCode);
  
  // Set CORS headers
  Object.keys(lambdaResponse.headers || {}).forEach(header => {
    res.set(header, lambdaResponse.headers[header]);
  });
  
  res.json(response);
};

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

app.get('/api/auth/verify', async (req, res) => {
  try {
    const event = expressToLambdaEvent(req);
    const result = await authHandler.handler(event);
    lambdaToExpressResponse(res, result);
  } catch (error) {
    console.error('Auth verify error:', error);
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SocTeamUp Backend API',
    version: '1.0.0',
    endpoints: [
      '/api/auth/register',
      '/api/auth/login', 
      '/api/auth/verify',
      '/api/auth/google/auth-url',
      '/api/auth/google/callback',
      '/api/contact'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SocTeamUp Backend Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}); 