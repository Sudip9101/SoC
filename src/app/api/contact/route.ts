import { NextRequest, NextResponse } from 'next/server';
import { saveContactSubmission } from '../../../lib/database';

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

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Log the form submission
    console.log('Contact form submission received:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Save to database
    try {
      const result = await saveContactSubmission({
        name,
        email,
        subject,
        message
      });

      if (result.success) {
        console.log(`Contact form submitted by ${name} (${email}): ${subject}`);
        console.log(`Saved to database with ID: ${result.submissionId}`);

        return NextResponse.json(
          {
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.',
            submissionId: result.submissionId
          },
          { status: 200, headers: corsHeaders }
        );
      } else {
        console.error('Failed to save contact submission to database');
        return NextResponse.json(
          { error: 'Failed to save submission' },
          { status: 500, headers: corsHeaders }
        );
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500, headers: corsHeaders }
      );
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    
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