import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, logAuthAction, updateLastLogin } from '@/lib/database';

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
    const { email, password } = body;

    // Basic validation
    const errors: string[] = [];

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 5) {
      errors.push('Password must be at least 5 characters long');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!user.is_active) {
      await logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      return NextResponse.json(
        { error: 'Account is inactive. Please contact administrator.' },
        { status: 401, headers: corsHeaders }
      );
    }

    if (!user.password_hash) {
      await logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      await logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: false
      });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401, headers: corsHeaders }
      );
    }

    await Promise.all([
      logAuthAction({
        user_id: user.id,
        action: 'login',
        ip_address: ip,
        user_agent: userAgent,
        success: true
      }),
      updateLastLogin(user.id)
    ]);

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
          avatar_url: user.avatar_url,
          lastLogin: new Date().toISOString(),
        },
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error processing login:', error);
    
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