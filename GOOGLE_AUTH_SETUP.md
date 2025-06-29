# Google Authentication Setup Guide

## 🎉 Current Status
✅ **Webpack Configuration**: Environment variables properly configured  
✅ **Google Auth Service**: Created and integrated  
✅ **UI Integration**: Added to AuthPage component  
✅ **Error Handling**: User-friendly error messages implemented  
✅ **Header Spacing**: Fixed consistent spacing in navigation  

## Prerequisites
1. A Google Cloud Platform (GCP) account
2. Access to the Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Fevl Management")
5. Click "Create"

### 2. Enable Google Identity Services
1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" and click "Enable"

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" for user type
   - Fill in the required fields:
     - App name: "Fevl Management"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed
4. For Application type, select "Web application"
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://192.168.0.159:3000` (for mobile testing)
   - Add your production domain when ready
6. Click "Create"

### 4. Copy the Client ID
1. After creation, you'll see your Client ID
2. Copy the Client ID (it looks like: `123456789012-abcdefghijklmnopqrstuvwxyz1234567.apps.googleusercontent.com`)

### 5. Update Your .env File
1. Open the `.env` file in your project root
2. Replace `your-google-client-id-here` with your actual Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz1234567.apps.googleusercontent.com
   ```

### 6. Restart Your Development Server
```bash
# Stop the current server (Ctrl+C) and restart
npm run start:mobile
```

## Testing
1. Open your app in the browser
2. Click "Sign In" 
3. Click "Continue with Google"
4. You should see the Google sign-in popup

## Troubleshooting

### Error: "Google Client ID is not configured"
- Make sure you've added the `REACT_APP_GOOGLE_CLIENT_ID` to your `.env` file
- Restart your development server after making changes to `.env`

### Error: "This app isn't verified"
- This is normal during development
- Click "Advanced" then "Go to [Your App Name] (unsafe)" to continue
- For production, you'll need to verify your app with Google

### Error: "Unauthorized JavaScript origin"
- Make sure you've added your development URL (`http://localhost:3000`) to the authorized origins in Google Cloud Console
- For mobile testing, also add `http://192.168.0.159:3000` (or your actual IP)

### Google sign-in popup doesn't appear
- Check if popup blockers are enabled
- Try using a different browser
- Check the browser console for errors

## Security Notes
- Never commit your `.env` file to version control
- The Client ID is not sensitive and can be exposed in the client-side code
- For production, consider implementing proper backend authentication
- Add your production domain to the authorized origins before deploying

## What Gets Extracted from Google
When a user signs in with Google, the following information is extracted:
- `name` - Full name
- `email` - Email address  
- `picture` - Profile picture URL
- `given_name` - First name
- `family_name` - Last name
- `email_verified` - Whether email is verified
- `sub` - Google user ID (unique identifier)

This information is used to create a user profile in your application.
