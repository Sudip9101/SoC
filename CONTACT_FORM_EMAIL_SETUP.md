# Contact Form & Email Setup Guide

## Current Status

✅ **Contact Form is Working!**
- Form submissions are being saved to MySQL database
- No errors in the backend
- Successfully tested with API call

## Issue Diagnosis

The contact form is **actually working correctly**. If you're seeing errors:

### Common Issues:

1. **Browser Console Errors** - Check browser developer console (F12)
2. **CORS Errors** - Frontend can't reach backend
3. **No Visual Feedback** - Form submits but no confirmation message
4. **Email Not Sending** - Currently email is disabled (optional feature)

---

## Email Functionality (Optional Enhancement)

Currently, contact form submissions are **only saved to the database**. To receive email notifications:

### Option 1: Enable Email with SMTP (Recommended)

I've created `server-with-email.js` which adds email functionality.

#### Step 1: Get SMTP Credentials

**Gmail (Easiest):**
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an "App Password" for email
4. Use these credentials in Step 2

**Other Options:**
- SendGrid (free 100 emails/day)
- AWS SES
- Mailgun
- Your company email server

#### Step 2: Update docker-compose.yml

Add these environment variables to the `backend` service:

```yaml
backend:
  environment:
    # ... existing variables ...
    
    # Email Configuration
    - SMTP_ENABLED=true
    - SMTP_HOST=smtp.gmail.com
    - SMTP_PORT=587
    - SMTP_SECURE=false
    - SMTP_USER=your-email@gmail.com
    - SMTP_PASS=your-app-password-here
    - SMTP_FROM=noreply@socteamup.com
    - SMTP_TO=admin@socteamup.com
```

#### Step 3: Update Backend Server

Replace the current backend with email-enabled version:

```bash
# Backup current server
cp server-production.js server-production-backup2.js

# Use email-enabled server
cp server-with-email.js server-production.js
```

#### Step 4: Add nodemailer Dependency

Update `package-backend-production.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1",
    "nodemailer": "^6.9.7"  ← Add this line
  }
}
```

#### Step 5: Rebuild and Restart

```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

#### Step 6: Test Email

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Email",
    "message": "Testing email functionality"
  }'
```

Check backend logs:
```bash
docker-compose logs backend --tail 30
```

You should see:
```
✅ Contact submission saved to database (ID: X)
✅ Contact email sent to admin@socteamup.com
✅ Auto-reply sent to test@example.com
```

---

### Option 2: View Submissions in Database (No Email Needed)

If you don't need emails, submissions are already being saved!

**View submissions:**

```bash
# Connect to MySQL
docker exec -it soc-mysql-1 mysql -u socteamup_user -psocteamup_password socteamup_db

# Query submissions
SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 10;
```

**Or create an Admin Dashboard:**

Access: `http://localhost:3000/admin/contact-logs`

This page can fetch and display submissions from the database.

---

## Troubleshooting Contact Form

### 1. Check if Backend is Receiving Requests

```bash
docker-compose logs backend --follow
```

Submit a form and watch for log entries.

### 2. Test Backend API Directly

```powershell
$testData = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject"
    message = "Test message"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/contact" `
  -Method POST `
  -Body $testData `
  -ContentType "application/json"
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you for contacting us. We will get back to you soon!"
}
```

### 3. Check CORS Configuration

Open browser console (F12) when submitting form.

If you see CORS errors:
```
Access to fetch at 'http://localhost:3001/api/contact' from origin 'http://localhost:3000' has been blocked by CORS policy
```

The backend already has CORS configured for localhost:3000, so this shouldn't happen.

### 4. Check Frontend API URL

Open `http://localhost:3000/contact` and check browser console:

```javascript
// Should log something like:
POST http://localhost:3001/api/contact
```

### 5. Verify Database Connection

```bash
# Check backend health
curl http://localhost:3001/health
```

Should show:
```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## Gmail SMTP Setup (Detailed)

### Step-by-Step Gmail Configuration:

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/

2. **Enable 2-Step Verification**
   - Security → 2-Step Verification → Turn On

3. **Generate App Password**
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "SoCTeamUp Contact Form"
   - Copy the 16-character password

4. **Update Environment Variables**
   ```yaml
   - SMTP_ENABLED=true
   - SMTP_HOST=smtp.gmail.com
   - SMTP_PORT=587
   - SMTP_SECURE=false
   - SMTP_USER=your-gmail@gmail.com
   - SMTP_PASS=xxxx xxxx xxxx xxxx  # 16-char app password
   - SMTP_FROM=your-gmail@gmail.com
   - SMTP_TO=where-you-want-notifications@gmail.com
   ```

5. **Rebuild Backend**
   ```bash
   docker-compose build --no-cache backend
   docker-compose up -d
   ```

---

## Alternative: Use SendGrid (Free Tier)

SendGrid offers 100 free emails per day:

1. **Sign up**: https://sendgrid.com/
2. **Create API Key**
3. **Update docker-compose.yml**:

```yaml
- SMTP_ENABLED=true
- SMTP_HOST=smtp.sendgrid.net
- SMTP_PORT=587
- SMTP_SECURE=false
- SMTP_USER=apikey
- SMTP_PASS=YOUR_SENDGRID_API_KEY
- SMTP_FROM=noreply@yourdomain.com
- SMTP_TO=admin@yourdomain.com
```

---

## Email Templates

When email is enabled, users receive:

**Admin Notification:**
```
Subject: New Contact Form: [Subject]

New Contact Form Submission

From: [Name] ([Email])
Company: [Company] (if provided)
Phone: [Phone] (if provided)
Subject: [Subject]

Message:
[Message content]

Received: [Timestamp]
```

**User Auto-Reply:**
```
Subject: Thank you for contacting SoCTeamUp

Dear [Name],

We have received your message and will get back to you as soon as possible.

Your message:
[Message content]

Best regards,
SoCTeamUp Team
```

---

## Security Best Practices

1. **Never commit SMTP credentials** to Git
2. **Use environment variables** for all sensitive data
3. **Use App Passwords** instead of actual passwords
4. **Enable rate limiting** to prevent spam (future enhancement)
5. **Add reCAPTCHA** to contact form (future enhancement)

---

## Current Configuration

**Without Email (Current):**
```
Contact Form → Validation → Save to Database → Success Response
```

**With Email (After Setup):**
```
Contact Form → Validation → Save to Database → Send Emails → Success Response
```

**Email failures won't break the form** - submissions are still saved to the database even if email fails.

---

## Quick Test Commands

```bash
# Check backend status
curl http://localhost:3001/health

# Test contact form
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Hi"}'

# View backend logs
docker-compose logs backend --tail 50

# View database submissions
docker exec -it soc-mysql-1 mysql -u socteamup_user -psocteamup_password \
  -e "SELECT * FROM socteamup_db.contact_submissions ORDER BY created_at DESC LIMIT 5;"
```

---

## Summary

✅ **Contact form is currently working** - submissions save to database  
📧 **Email is optional** - follow guide above to enable  
🔍 **If you see errors** - check browser console and backend logs  
📊 **View submissions** - check database or create admin dashboard  

Need help? Run the test commands above and share any error messages!


