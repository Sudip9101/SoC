/**
 * AWS Lambda function for handling contact form submissions
 * This function processes form data, validates input, and sends notifications
 */

// Commented out AWS SDK initialization due to credential issues
// const AWS = require('aws-sdk');
// const ses = new AWS.SES({ region: 'us-east-1' });
const { saveContactSubmission } = require('./database');

// CORS headers for frontend integration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// Input validation function
const validateInput = (data) => {
  const { name, email, subject, message } = data;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!subject || subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  return errors;
};

// Send email notification
// Commented out due to AWS credentials issue
/*
const sendEmail = async (formData) => {
  const { name, email, subject, message } = formData;
  
  const emailParams = {
    Destination: {
      ToAddresses: [process.env.CONTACT_EMAIL || 'support@socteamup.com']
    },
    Message: {
      Body: {
        Html: {
          Data: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Sent from SocTeamUp Contact Form</small></p>
          `
        },
        Text: {
          Data: `
            New Contact Form Submission
            
            Name: ${name}
            Email: ${email}
            Subject: ${subject}
            
            Message:
            ${message}
            
            ---
            Sent from SocTeamUp Contact Form
          `
        }
      },
      Subject: {
        Data: `[SocTeamUp] ${subject}`
      }
    },
    Source: process.env.FROM_EMAIL || 'noreply@socteamup.com'
  };

  return ses.sendEmail(emailParams).promise();
};
*/

// Auto-reply to user
// Commented out due to AWS credentials issue
/*
const sendAutoReply = async (userEmail, userName) => {
  const autoReplyParams = {
    Destination: {
      ToAddresses: [userEmail]
    },
    Message: {
      Body: {
        Html: {
          Data: `
            <h2>Thank you for contacting SocTeamUp!</h2>
            <p>Dear ${userName},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>In the meantime, you can:</p>
            <ul>
              <li>Visit our website: <a href="https://socteamup.com">socteamup.com</a></li>
              <li>Check out our latest updates</li>
              <li>Follow us on social media</li>
            </ul>
            <p>Best regards,<br>The SocTeamUp Team</p>
            <hr>
            <p><small>This is an automated response. Please do not reply to this email.</small></p>
          `
        },
        Text: {
          Data: `
            Thank you for contacting SocTeamUp!
            
            Dear ${userName},
            
            We have received your message and will get back to you as soon as possible.
            
            In the meantime, you can:
            - Visit our website: https://socteamup.com
            - Check out our latest updates
            - Follow us on social media
            
            Best regards,
            The SocTeamUp Team
            
            ---
            This is an automated response. Please do not reply to this email.
          `
        }
      },
      Subject: {
        Data: 'Thank you for contacting SocTeamUp'
      }
    },
    Source: process.env.FROM_EMAIL || 'noreply@socteamup.com'
  };

  return ses.sendEmail(autoReplyParams).promise();
};
*/

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Contact form submission received:', JSON.stringify(event, null, 2));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const formData = JSON.parse(event.body);
    console.log('Form data:', formData);

    // Validate input
    const validationErrors = validateInput(formData);
    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Validation failed',
          details: validationErrors
        })
      };
    }

    // Save to database
    const dbResult = await saveContactSubmission(formData);
    console.log('Contact submission saved to database:', dbResult);

    // Try to send notification email to team (optional)
    // Commented out for now due to AWS credentials issue
    /*
    try {
      await sendEmail(formData);
      console.log('Notification email sent successfully');
    } catch (emailError) {
      console.log('Email sending failed (non-critical):', emailError.message);
      // Don't fail the request if email fails
    }
    */

    // Try to send auto-reply to user (optional)
    // Commented out for now due to AWS credentials issue
    /*
    try {
      await sendAutoReply(formData.email, formData.name);
      console.log('Auto-reply sent successfully');
    } catch (autoReplyError) {
      console.log('Auto-reply sending failed (non-critical):', autoReplyError.message);
      // Don't fail the request if auto-reply fails
    }
    */

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.'
      })
    };

  } catch (error) {
    console.error('Error processing contact form:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Unable to process your request. Please try again later.'
      })
    };
  }
}; 