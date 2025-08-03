# Google OAuth Setup Guide

## 🎯 **Current Issue**
When you click "Continue with Google", it's directly logging you in without showing the Google account selection page. This is because the system is currently using **mock data** instead of real Google OAuth.

## ✅ **Solution: Enable Real Google OAuth**

### **Step 1: Create Google OAuth Credentials**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project** (if you don't have one)
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it something like "SoC Team Up OAuth"
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google OAuth2 API"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "SoC Team Up Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3002/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
   - Click "Create"
   - **Save the Client ID and Client Secret**

### **Step 2: Configure Environment Variables**

Create a `.env.local` file in your project root:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
```

### **Step 3: Restart Your Application**

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### **Step 4: Test Real Google OAuth**

1. Go to your login page
2. Click "Continue with Google"
3. You should now see the **Google account selection page**
4. Choose your Google account
5. Grant permissions
6. You'll be redirected back to your application

## 🔧 **Alternative: Keep Mock Mode for Testing**

If you want to keep using mock data for testing, the current system will continue to work. The mock mode will:

- ✅ Still store users in the database
- ✅ Still log authentication activities
- ✅ Still work for development/testing
- ❌ Won't show real Google account selection

## 🎉 **Expected Behavior After Setup**

With real Google OAuth configured:

1. **Click "Continue with Google"**
2. **Redirect to Google's account selection page**
3. **Choose your Google account**
4. **Grant permissions to the app**
5. **Redirect back to your application**
6. **User data stored in MySQL database**

## 🚨 **Important Notes**

- **Client Secret**: Never commit this to version control
- **Redirect URI**: Must match exactly what you configure in Google Console
- **HTTPS**: Required for production (Google requirement)
- **Localhost**: Works for development on port 3002

## 📋 **Verification**

After setup, you can verify it's working by:

1. Checking the browser console for "Generated real Google auth URL"
2. Checking the server logs for "Real Google OAuth callback"
3. Running `node check-google-users.js` to see real Google users in database

The system will now show the proper Google account selection page instead of directly logging in! 🎉 