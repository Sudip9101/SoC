import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Check if this is a real Google OAuth callback or mock
    const { code } = data;
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // If it's a mock code (development), use mock data
    if (code.startsWith('mock_auth_code_')) {
      // Mock Google OAuth response for development
      const mockGoogleUser = {
        id: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'testuser@gmail.com',
        name: 'Test Google User',
        picture: 'https://via.placeholder.com/100',
        verified_email: true
      };

      // Generate mock JWT token
      const token = 'jwt_' + Math.random().toString(36).substr(2, 20);

      console.log('Google OAuth callback (development):', {
        user: mockGoogleUser,
        timestamp: new Date().toISOString()
      });

      // Save user to database
      try {
        const { createUser, getUserByEmail, logAuthAction } = require('../../../../lib/database');
        
        // Check if user already exists
        let existingUser = await getUserByEmail(mockGoogleUser.email);
        let userId;

        if (!existingUser) {
          // Create new user
          const createResult = await createUser({
            email: mockGoogleUser.email,
            name: mockGoogleUser.name,
            google_id: mockGoogleUser.id,
            avatar_url: mockGoogleUser.picture
          });
          
          if (createResult.success) {
            userId = createResult.userId;
            console.log('✅ New user created in database:', mockGoogleUser.email);
          } else {
            console.log('⚠️ User creation failed:', createResult.error);
          }
        } else {
          userId = existingUser.id;
          console.log('✅ Existing user found:', existingUser.email);
        }

        // Log authentication action
        if (userId) {
          await logAuthAction({
            user_id: userId,
            action: 'login',
            ip_address: '127.0.0.1',
            user_agent: 'Google OAuth',
            success: true
          });
          console.log('✅ Auth action logged for user:', userId);
        }

      } catch (dbError) {
        console.error('❌ Database error during Google OAuth:', dbError);
      }

      return NextResponse.json({
        success: true,
        message: 'Google authentication successful!',
        token,
        user: {
          userId: mockGoogleUser.id,
          email: mockGoogleUser.email,
          name: mockGoogleUser.name,
          picture: mockGoogleUser.picture,
          provider: 'google',
          isVerified: true,
          lastLogin: new Date().toISOString()
        }
      });
    } else {
      // Real Google OAuth callback
      try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/google/callback`;
        
        if (!googleClientId || !googleClientSecret) {
          return NextResponse.json(
            { error: 'Google OAuth not properly configured' },
            { status: 500 }
          );
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: googleClientId,
            client_secret: googleClientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          }),
        });

        if (!tokenResponse.ok) {
          console.error('Google token exchange failed:', await tokenResponse.text());
          return NextResponse.json(
            { error: 'Failed to exchange authorization code' },
            { status: 400 }
          );
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!userInfoResponse.ok) {
          console.error('Failed to get user info from Google');
          return NextResponse.json(
            { error: 'Failed to get user information from Google' },
            { status: 400 }
          );
        }

        const googleUser = await userInfoResponse.json();
        
        console.log('Real Google OAuth callback:', {
          user: googleUser,
          timestamp: new Date().toISOString()
        });

        // Save real Google user to database
        try {
          const { createUser, getUserByEmail, logAuthAction } = require('../../../../lib/database');
          
          let existingUser = await getUserByEmail(googleUser.email);
          let userId;

          if (!existingUser) {
            const createResult = await createUser({
              email: googleUser.email,
              name: googleUser.name,
              google_id: googleUser.id,
              avatar_url: googleUser.picture
            });
            
            if (createResult.success) {
              userId = createResult.userId;
              console.log('✅ New real Google user created in database:', googleUser.email);
            } else {
              console.log('⚠️ Real Google user creation failed:', createResult.error);
            }
          } else {
            userId = existingUser.id;
            console.log('✅ Existing real Google user found:', existingUser.email);
          }

          if (userId) {
            await logAuthAction({
              user_id: userId,
              action: 'login',
              ip_address: '127.0.0.1',
              user_agent: 'Google OAuth',
              success: true
            });
            console.log('✅ Real Google OAuth action logged for user:', userId);
          }

        } catch (dbError) {
          console.error('❌ Database error during real Google OAuth:', dbError);
        }

        const token = 'jwt_' + Math.random().toString(36).substr(2, 20);

        return NextResponse.json({
          success: true,
          message: 'Google authentication successful!',
          token,
          user: {
            userId: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            provider: 'google',
            isVerified: googleUser.verified_email,
            lastLogin: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Error processing real Google OAuth:', error);
        return NextResponse.json(
          { error: 'Failed to process Google authentication' },
          { status: 500 }
        );
      }
    }

    // For production, proxy to Lambda function
    const lambdaUrl = process.env.GOOGLE_AUTH_LAMBDA_URL;
    if (!lambdaUrl) {
      return NextResponse.json(
        { error: 'Google authentication service not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`${lambdaUrl}/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in Google OAuth callback:', error);
    
    return NextResponse.json(
      { 
        error: 'Google authentication failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 