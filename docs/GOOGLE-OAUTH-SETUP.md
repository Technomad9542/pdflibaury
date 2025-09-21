# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your PDF Library application.

## Prerequisites

1. A Supabase project (you already have this based on your .env file)
2. A Google Cloud Platform account

## Step 1: Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list of providers and click on it
4. Toggle the switch to enable Google authentication
5. You'll need to provide:
   - **Client ID** (from Google Cloud Console)
   - **Secret** (from Google Cloud Console)

## Step 2: Set up Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Add the following to **Authorized redirect URIs**:
   ```
   https://YOUR_SUPABASE_PROJECT_URL/auth/v1/callback
   ```
   (Replace `YOUR_SUPABASE_PROJECT_URL` with your actual Supabase project URL from your .env file)
   
   For example:
   ```
   https://sqemfpinfxpodrkkgbla.supabase.co/auth/v1/callback
   ```

7. Click **Create** and copy the **Client ID** and **Client Secret**

## Step 3: Complete Supabase Configuration

1. Back in your Supabase dashboard, paste the **Client ID** and **Secret** into the Google provider settings
2. Save the configuration

## Step 4: Add Redirect URLs

In the Supabase dashboard, under **Authentication** → **URL Configuration**, add these URLs to the **Redirect URLs**:
- `http://localhost:5173`
- `http://localhost:5173/library`
- `http://localhost:5173/search`
- `https://YOUR_DEPLOYED_APP_URL` (if deployed)
- `https://YOUR_DEPLOYED_APP_URL/library` (if deployed)
- `https://YOUR_DEPLOYED_APP_URL/search` (if deployed)

## Testing

After completing these steps, you should be able to:
1. See a "Login with Google" button in the header
2. Click the button to open the Google OAuth popup
3. After successful authentication, you'll be redirected to the /library page

## Troubleshooting

If you encounter issues:

1. **Check browser console** for any JavaScript errors
2. **Verify environment variables** in your .env file
3. **Ensure Supabase credentials** are correct
4. **Check network tab** for any failed API requests to Supabase

If you see a "Redirect URL not allowed" error, make sure you've added the correct redirect URLs in the Supabase dashboard.