import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { testConnection, createUser, getUserByEmail, logAuthAction } from '@/lib/database';

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

// Input validation
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 5; // Temporarily reduced for testing
};

// Extract client IP and user agent
const getClientInfo = (request: NextRequest) => {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
            request.headers.get('x-real-ip') || 
            '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  return { ip, userAgent };
};

// Handle POST requests
export async function POST(request: NextRequest) {
  const { ip, userAgent } = getClientInfo(request);
  
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
      errors.push('Password must be at least 5 characters long');
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

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email address' },
        { status: 409, headers: corsHeaders }
      );
    }

    // Hash the password securely
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await createUser({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password_hash
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create user' },
        { status: 400, headers: corsHeaders }
      );
    }

    await logAuthAction({
      user_id: result.userId,
      action: 'register',
      ip_address: ip,
      user_agent: userAgent,
      success: true
    });

    const mockToken = `mock_jwt_${result.userId}_${Date.now()}`;

    return NextResponse.json(
      {
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
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error processing registration:', error);
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
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