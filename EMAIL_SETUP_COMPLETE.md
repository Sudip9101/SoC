# ✅ Email Functionality - Setup Complete (Pending App Password)

## What's Been Done:

✅ **Backend updated** with email support (nodemailer)  
✅ **docker-compose.yml configured** with SMTP environment variables  
✅ **Gmail settings pre-configured** for socteamup28@gmail.com  
✅ **Documentation created** for management  

---

## What You Need to Do:

### Step 1: Get Gmail App Password

1. Go to https://myaccount.google.com/ (sign in with socteamup28@gmail.com)
2. Enable **2-Step Verification** (Security → 2-Step Verification)
3. Generate **App Password** (Security → 2-Step Verification → App passwords)
   - Select: **Mail** and **Other (Custom name)**
   - Name it: **SoCTeamUp Contact Form**
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update docker-compose.yml

Open `docker-compose.yml` and find line 42:

```yaml
- SMTP_PASS=your-gmail-app-password-here
```

Replace with your actual App Password:

```yaml
- SMTP_PASS=abcdefghijklmnop
```

(Remove spaces from the App Password)

### Step 3: Start Docker Desktop

Make sure Docker Desktop is running on Windows.

### Step 4: Rebuild and Start Containers

Open PowerShell in the project directory and run:

```powershell
# Stop existing containers
docker-compose down

# Rebuild backend with email support
docker-compose build --no-cache backend

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Step 5: Verify Email is Working

Check backend health:

```powershell
curl http://localhost:3001/health
```

Should show:
```json
{
  "status": "ok",
  "database": "connected",
  "email": "enabled"  ← Should say "enabled"
}
```

### Step 6: Test Contact Form

1. **Via Website:**
   - Go to: http://localhost:3000/contact
   - Fill out and submit the form
   - Check socteamup28@gmail.com inbox for notification

2. **Via API:**
   ```powershell
   $testData = @{
       name = "Test User"
       email = "test@example.com"
       subject = "Test Email"
       message = "Testing email functionality"
   } | ConvertTo-Json

   Invoke-WebRequest -Uri "http://localhost:3001/api/contact" `
     -Method POST `
     -Body $testData `
     -ContentType "application/json"
   ```

3. **Check Logs:**
   ```powershell
   docker-compose logs backend --tail 30
   ```

   Should see:
   ```
   ✅ Contact submission saved to database (ID: X)
   ✅ Contact email sent to socteamup28@gmail.com
   ✅ Auto-reply sent to test@example.com
   ```

---

## Current Configuration:

### SMTP Settings (in docker-compose.yml):

```yaml
# Email/SMTP Configuration
- SMTP_ENABLED=true                      # Email enabled
- SMTP_HOST=smtp.gmail.com               # Gmail SMTP
- SMTP_PORT=587                          # Gmail port
- SMTP_SECURE=false                      # TLS (not SSL)
- SMTP_USER=socteamup28@gmail.com       # Sending email
- SMTP_PASS=your-gmail-app-password-here # ← REPLACE THIS
- SMTP_FROM=socteamup28@gmail.com       # From address
- SMTP_TO=socteamup28@gmail.com         # Where notifications go
```

### What Happens When Someone Submits Contact Form:

1. ✅ Form data validated
2. ✅ Submission saved to MySQL database
3. ✅ Email sent to: **socteamup28@gmail.com** (admin notification)
4. ✅ Auto-reply sent to: **customer's email** (thank you message)
5. ✅ Success response returned to website

---

## Email Templates:

### Admin Notification Email:
```
Subject: New Contact Form: [Subject]

New Contact Form Submission

From: [Name] ([Email])
Company: [Company]
Phone: [Phone]
Subject: [Subject]

Message:
[Message content]

Received: [Timestamp]
```

### Customer Auto-Reply:
```
Subject: Thank you for contacting SoCTeamUp

Dear [Name],

We have received your message and will get back to you 
as soon as possible.

Your message:
[Message content]

Best regards,
SoCTeamUp Team
```

---

## For Management - Easy Configuration Changes:

### Change Where Notifications Go:
```yaml
- SMTP_TO=admin@socteamup.com  # Different email
```

### Use Multiple Recipients:
```yaml
- SMTP_TO=admin@socteamup.com,manager@socteamup.com
```

### Switch to Company SMTP:
```yaml
- SMTP_ENABLED=true
- SMTP_HOST=smtp.yourcompany.com
- SMTP_PORT=587
- SMTP_SECURE=false
- SMTP_USER=noreply@yourcompany.com
- SMTP_PASS=company-password
- SMTP_FROM=noreply@yourcompany.com
- SMTP_TO=support@yourcompany.com
```

### Disable Email (keep database saving):
```yaml
- SMTP_ENABLED=false
```

After any changes, rebuild:
```powershell
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

---

## Files Updated:

1. ✅ `server-production.js` - Now includes email functionality
2. ✅ `package-backend-production.json` - Added nodemailer package
3. ✅ `docker-compose.yml` - Added SMTP environment variables
4. ✅ `GMAIL_APP_PASSWORD_SETUP.md` - Detailed instructions
5. ✅ `CONTACT_FORM_EMAIL_SETUP.md` - Complete email guide

---

## Backup Files Created:

- `server-production-no-email.backup.js` - Original without email
- `server-production.backup.js` - Previous backup
- `server-with-email.js` - Email-enabled version (now active)

---

## Important Notes:

⚠️ **Security:**
- Gmail App Password is application-specific
- Never commit passwords to Git
- Can be revoked anytime from Google Account settings
- More secure than using actual Gmail password

✅ **Reliability:**
- Contact forms still work even if email fails
- Submissions always saved to database
- Email failures logged but don't break the form

🔄 **Fallback:**
- If SMTP not configured: Forms save to database only
- If email fails: Submission still succeeds
- Can view all submissions in MySQL database

---

## Quick Start Commands:

```powershell
# 1. Start Docker Desktop

# 2. Update SMTP_PASS in docker-compose.yml with App Password

# 3. Rebuild and start
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d

# 4. Check status
docker-compose ps
docker-compose logs backend --tail 20

# 5. Test
curl http://localhost:3001/health
```

---

## Need Help?

- See: `GMAIL_APP_PASSWORD_SETUP.md` - Gmail setup instructions
- See: `CONTACT_FORM_EMAIL_SETUP.md` - Complete email guide
- Check logs: `docker-compose logs backend`
- Test API: http://localhost:3001/health

---

## Summary:

✅ **Ready to enable email** - Just need Gmail App Password  
📧 **Email**: socteamup28@gmail.com  
🔧 **Management friendly** - Easy to change via environment variables  
🔄 **Flexible** - Can switch to company SMTP anytime  
💾 **Safe** - Forms save to database regardless of email status  

**Next step:** Get Gmail App Password and update `docker-compose.yml` line 42!




