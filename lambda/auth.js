/**
 * AWS Lambda function for user authentication
 * Handles registration, login, JWT token generation, and user management
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Import database functions
const { 
  createUser, 
  getUserByEmail, 
  getUserById, 
  updateUser, 
  logAuthAction,
  authenticateUser,
  getUserByEmailAndPassword
} = require('./database');

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};

// Input validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateInput = (data, type) => {
  const errors = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (type === 'register') {
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!validatePassword(data.password)) {
      errors.push('Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number');
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }
  }

  return errors;
};

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Check if user exists (using imported function)
const checkUserByEmail = async (email) => {
  return await getUserByEmail(email);
};

// Create new user
const createNewUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const userDataForDB = {
    email: userData.email,
    name: userData.name,
    password_hash: hashedPassword
  };

  return await createUser(userDataForDB);
};

// Update user login info
const updateUserLogin = async (userId) => {
  const updates = {
    last_login: new Date().toISOString(),
    login_count: 1  // Increment login count
  };

  await updateUser(userId, updates);
};

// Send welcome email (placeholder - can be implemented later)
const sendWelcomeEmail = async (email, name) => {
  console.log(`Welcome email would be sent to ${email} for user ${name}`);
  // Email functionality can be implemented later
  return Promise.resolve();
};

// Handle user registration
const handleRegister = async (data) => {
  console.log('Starting registration process for:', data.email);
  
  // Validate input
  const validationErrors = validateInput(data, 'register');
  if (validationErrors.length > 0) {
    console.log('Validation errors:', validationErrors);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Validation failed',
        details: validationErrors
      })
    };
  }

  console.log('Validation passed, checking if user exists...');

  // Check if user already exists
  const existingUser = await checkUserByEmail(data.email);
  if (existingUser) {
    console.log('User already exists:', data.email);
    return {
      statusCode: 409,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'User already exists with this email address'
      })
    };
  }

  console.log('User does not exist, creating new user...');

  // Create new user
  const result = await createNewUser(data);
  console.log('Create user result:', result);
  
  if (!result.success) {
    console.log('Failed to create user:', result.error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: result.error || 'Failed to create user'
      })
    };
  }

  const user = {
    userId: result.userId,
    email: data.email,
    name: data.name,
    createdAt: new Date().toISOString()
  };
  
  console.log('User created successfully, generating token...');
  
  // Generate JWT token
  const token = generateToken(user.userId, user.email);
  console.log('Token generated successfully');

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name);
    console.log('Welcome email sent');
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Don't fail registration if email fails
  }

  console.log('Registration completed successfully');

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    })
  };
};

// Handle user login
const handleLogin = async (data) => {
  console.log('Starting login process for:', data.email);
  
  // Validate input
  const validationErrors = validateInput(data, 'login');
  if (validationErrors.length > 0) {
    console.log('Login validation errors:', validationErrors);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Validation failed',
        details: validationErrors
      })
    };
  }

  console.log('Login validation passed, checking user credentials...');

  // Get user by email first
  const user = await getUserByEmail(data.email);
  if (!user) {
    console.log('User not found:', data.email);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid email or password'
      })
    };
  }

  console.log('User found, verifying password...');

  // Verify password using bcrypt.compare
  const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
  if (!isPasswordValid) {
    console.log('Password verification failed for:', data.email);
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid email or password'
      })
    };
  }

  console.log('Password verified successfully, updating login info...');

  // Update login info (commented out since last_login and login_count columns don't exist)
  // await updateUserLogin(user.id);

  console.log('Generating JWT token...');

  // Generate JWT token
  const token = generateToken(user.id, user.email);

  console.log('Login successful for:', data.email);

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        lastLogin: new Date().toISOString()
      }
    })
  };
};

// Handle token verification
const handleVerify = async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Missing or invalid authorization header'
      })
    };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid or expired token'
      })
    };
  }

  // Get current user data
  const user = await getUserByEmail(decoded.email);
  if (!user) {
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'User not found'
      })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      valid: true,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin
      }
    })
  };
};

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Auth request received:', JSON.stringify(event, null, 2));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const path = event.path || event.rawPath;
    const method = event.httpMethod;

    console.log('Processing request:', method, path);

    // Route handling
    if (method === 'POST' && path.includes('/register')) {
      console.log('Handling registration request');
      const data = JSON.parse(event.body);
      console.log('Registration data:', data);
      const result = await handleRegister(data);
      console.log('Registration result:', result);
      return result;
    }
    
    if (method === 'POST' && path.includes('/login')) {
      console.log('Handling login request');
      const data = JSON.parse(event.body);
      const result = await handleLogin(data);
      console.log('Login result:', result);
      return result;
    }
    
    if (method === 'GET' && path.includes('/verify')) {
      console.log('Handling verify request');
      const result = await handleVerify(event);
      console.log('Verify result:', result);
      return result;
    }

    // Invalid route
    console.log('Invalid route:', method, path);
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('Error processing auth request:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 