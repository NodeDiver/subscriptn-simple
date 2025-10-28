# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for Bitinfrashop.

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `Bitinfrashop` (or your preferred name)
4. Click "Create"

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" and click "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in required fields:
     - App name: `Bitinfrashop`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email address)

### 1.4 Configure OAuth Client
1. Application type: "Web application"
2. Name: `Bitinfrashop Web Client`
3. Authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
4. Click "Create"

### 1.5 Get Credentials
1. Copy the **Client ID** and **Client Secret**
2. Keep these secure - you'll need them for environment variables

## 🔐 Step 2: Environment Configuration

### 2.1 Update .env.local
Add the following to your `.env.local` file:

```env
# NextAuth.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2.2 Generate NextAuth Secret
Generate a secure secret for NextAuth:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

## 🚀 Step 3: Test the Setup

### 3.1 Start the Development Server
```bash
npm run dev
```

### 3.2 Test Google Login
1. Go to `http://localhost:3000/login`
2. Click "Continue with Google"
3. Complete the Google OAuth flow
4. You should be redirected back to the dashboard

## 🔒 Step 4: Production Deployment

### 4.1 Update OAuth Settings
1. Go back to Google Cloud Console → "Credentials"
2. Edit your OAuth 2.0 Client ID
3. Add production redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Update authorized domains if needed

### 4.2 Environment Variables
Update your production environment variables:

```env
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
NEXTAUTH_SECRET=your_production_secret
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Error 400: redirect_uri_mismatch"
- **Cause**: Redirect URI doesn't match what's configured in Google Console
- **Solution**: Ensure redirect URI in Google Console exactly matches your domain

#### 2. "Access blocked: This app's request is invalid"
- **Cause**: OAuth consent screen not properly configured
- **Solution**: Complete the OAuth consent screen setup in Google Console

#### 3. "Invalid client" error
- **Cause**: Wrong Client ID or Client Secret
- **Solution**: Double-check environment variables match Google Console

#### 4. Database errors after Google login
- **Cause**: Database schema not updated
- **Solution**: Run `npx prisma db push` to apply schema changes

### Debug Mode
Enable debug mode in development:

```env
NEXTAUTH_DEBUG=true
```

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🔐 Security Notes

1. **Never commit** `.env.local` or `.env` files to version control
2. **Use different credentials** for development and production
3. **Rotate secrets** regularly in production
4. **Monitor OAuth usage** in Google Cloud Console
5. **Use HTTPS** in production (required by Google OAuth)

---

**Need help?** Contact: nodediver@proton.me
