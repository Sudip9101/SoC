# Gmail App Password Setup for socteamup28@gmail.com

## Quick Instructions for Management

To enable email functionality, you need to generate a Gmail App Password for `socteamup28@gmail.com`.

---

## Step-by-Step Instructions:

### 1. Sign in to Gmail Account
- Go to: https://myaccount.google.com/
- Sign in with: **socteamup28@gmail.com**

### 2. Enable 2-Step Verification (if not already enabled)
- Click on **Security** (left sidebar)
- Scroll to **How you sign in to Google**
- Click **2-Step Verification**
- Follow the prompts to enable it
- You'll need to verify with phone number

### 3. Generate App Password
- After 2-Step Verification is enabled
- Go to: https://myaccount.google.com/apppasswords
- OR: Security → 2-Step Verification → App passwords (at bottom)
- Select app: **Mail**
- Select device: **Other (Custom name)**
- Enter name: **SoCTeamUp Website Contact Form**
- Click **Generate**

### 4. Copy the App Password
- You'll see a 16-character password like: `abcd efgh ijkl mnop`
- **Copy this password** (spaces don't matter)

### 5. Update docker-compose.yml
- Open `docker-compose.yml`
- Find the line: `- SMTP_PASS=your-gmail-app-password-here`
- Replace with: `- SMTP_PASS=abcdefghijklmnop` (your actual password)

### 6. Rebuild and Restart
Run these commands:
```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

### 7. Test Email
After containers start, test the contact form at:
- http://localhost:3000/contact

Or test via API:
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Testing email"}'
```

Check backend logs:
```bash
docker-compose logs backend --tail 30
```

You should see:
```
✅ Contact submission saved to database (ID: X)
✅ Contact email sent to socteamup28@gmail.com
✅ Auto-reply sent to test@test.com
```

---

## Configuration in docker-compose.yml:

```yaml
# Email/SMTP Configuration (Management can update these)
- SMTP_ENABLED=true                      # Set to false to disable email
- SMTP_HOST=smtp.gmail.com               # Gmail SMTP server
- SMTP_PORT=587                          # Gmail SMTP port
- SMTP_SECURE=false                      # false for port 587
- SMTP_USER=socteamup28@gmail.com       # Gmail account
- SMTP_PASS=your-gmail-app-password-here # Replace with App Password
- SMTP_FROM=socteamup28@gmail.com       # Email "from" address
- SMTP_TO=socteamup28@gmail.com         # Where to receive contact forms
```

---

## To Change Email Settings Later:

### Use Different Email for Receiving:
```yaml
- SMTP_TO=admin@yourcompany.com  # Different email for notifications
```

### Use Company SMTP Server:
```yaml
- SMTP_HOST=smtp.yourcompany.com
- SMTP_PORT=587
- SMTP_USER=noreply@yourcompany.com
- SMTP_PASS=your-company-password
- SMTP_FROM=noreply@yourcompany.com
- SMTP_TO=admin@yourcompany.com
```

### Disable Email Temporarily:
```yaml
- SMTP_ENABLED=false  # Contact forms still save to database
```

---

## Security Notes:

⚠️ **Important:**
- Never commit the App Password to Git
- Use environment variables or secrets management
- The App Password is specific to this application
- You can revoke it anytime from Google Account settings

✅ **Current Setup:**
- Contact forms save to MySQL database (always)
- Emails sent if SMTP is configured (optional)
- If email fails, form submission still succeeds

---

## Troubleshooting:

### "Invalid credentials" error:
- Make sure 2-Step Verification is enabled
- Generate a new App Password
- Check that you copied it correctly (no spaces needed)

### "Connection timeout" error:
- Check firewall settings
- Verify port 587 is not blocked
- Try port 465 with `SMTP_SECURE=true`

### Emails not arriving:
- Check Gmail Spam folder
- Check backend logs: `docker-compose logs backend`
- Verify SMTP_TO email address is correct

---

## Current Status:

✅ **Configured:**
- Backend updated with email support
- nodemailer package added
- Environment variables configured
- Ready to use once App Password is added

❌ **Pending:**
- Gmail App Password needs to be generated
- Update `SMTP_PASS` in docker-compose.yml
- Rebuild backend container

---

## Contact:

If you have issues, check:
1. Backend logs: `docker-compose logs backend`
2. Backend health: http://localhost:3001/health
3. Documentation: `CONTACT_FORM_EMAIL_SETUP.md`




