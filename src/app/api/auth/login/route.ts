import { NextRequest, NextResponse } from 'next/server';

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

// Mock users for development (this should be retrieved from database in production)
const getMockUsers = () => [
  {
    userId: 'user_demo',
    name: 'Demo User',
    email: 'demo@socteamup.com',
    password: 'password123', // In production, this would be hashed
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    userId: 'admin_main',
    name: 'Admin User',
    email: 'admin@socteamup.com',
    password: 'admin123456', // In production, this would be hashed
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

// Input validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    const errors: string[] = [];

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Authenticate user from database
    try {
      const { getUserByEmailAndPassword, logAuthAction } = require('../../../../lib/database');
      
      // Find user by email and password
      const user = await getUserByEmailAndPassword(email, password);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401, headers: corsHeaders }
        );
      }

      // Log successful login
      await logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: '127.0.0.1',
        user_agent: 'Login Form',
        success: true
      });

      console.log('✅ User login successful:', {
        userId: user.id,
        email: user.email,
        name: user.name,
        timestamp: new Date().toISOString(),
      });

      // Generate JWT token (in production, use proper JWT library)
      const mockToken = `mock_jwt_${user.id}_${Date.now()}`;

      return NextResponse.json(
        {
          success: true,
          message: 'Login successful!',
          token: mockToken,
          user: {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            lastLogin: new Date().toISOString(),
          },
        },
        { status: 200, headers: corsHeaders }
      );

    } catch (dbError) {
      console.error('❌ Database error during login:', dbError);
      return NextResponse.json(
        { error: 'Database error occurred during login' },
        { status: 500, headers: corsHeaders }
      );
    }

  } catch (error) {
    console.error('Error processing login:', error);
    
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