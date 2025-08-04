import { NextRequest, NextResponse } from 'next/server';
// Database functions will be imported using require

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Simple in-memory storage for development (use database in production)
const users: any[] = [];

// Input validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 5; // Temporarily reduced for testing
};

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Basic validation
    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || !validatePassword(password)) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists in database
    try {
      const { createUser, getUserByEmail, logAuthAction } = require('../../../../lib/database');
      
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists with this email address' },
          { status: 409, headers: corsHeaders }
        );
      }

      // Create new user in database
      const createResult = await createUser({
        email,
        name,
        password_hash: password, // In production, hash this password
        role: 'user'
      });

      if (!createResult.success) {
        return NextResponse.json(
          { error: createResult.error || 'Failed to create user' },
          { status: 500, headers: corsHeaders }
        );
      }

      // Log registration action
      await logAuthAction({
        user_id: createResult.userId,
        action: 'register',
        ip_address: '127.0.0.1',
        user_agent: 'Registration Form',
        success: true
      });

      console.log('✅ User registration successful:', {
        userId: createResult.userId,
        name,
        email,
        timestamp: new Date().toISOString(),
      });

      // Generate JWT token (in production, use proper JWT library)
      const mockToken = `mock_jwt_${createResult.userId}_${Date.now()}`;

      return NextResponse.json(
        {
          success: true,
          message: 'Registration successful!',
          token: mockToken,
          user: {
            userId: createResult.userId,
            email,
            name,
            createdAt: new Date().toISOString(),
          },
        },
        { status: 201, headers: corsHeaders }
      );

    } catch (dbError) {
      console.error('❌ Database error during registration:', dbError);
      return NextResponse.json(
        { error: 'Database error occurred during registration' },
        { status: 500, headers: corsHeaders }
      );
    }

  } catch (error) {
    console.error('Error processing registration:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: corsHeaders }
  );
} 