# Sakura Player - Configuration Guide

## Setup Instructions

### 1. Get Spotify Credentials
1. Go to https://developer.spotify.com/dashboard
2. Create a new app (or select existing)
3. Accept the terms and create the app
4. You'll get a `Client ID` and `Client Secret`
5. Go to "Edit Settings" and add Redirect URI: `http://127.0.0.1:8888/callback`

### 2. Configure Environment Variables
Edit the `.env` file in your project root with your credentials:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://127.0.0.1:8888/callback
```

## What's Fixed

### ✅ Unsafe Redirect URL
- Updated the callback endpoint to use safer HTML/JavaScript instead of inline script injection
- Added proper CORS headers to the backend
- Improved user feedback messages

### ✅ Persistent Login
- Tokens are now saved to `localStorage` when you log in
- On app restart, the saved token is automatically restored
- You only need to log in once!
- Logout clears the saved token

## How It Works

1. **First Login**: Click "Connect with Spotify" → Opens Spotify auth → Returns and saves token
2. **App Restart**: App automatically restores your token and shows the player
3. **Logout**: Clears your token and returns to login screen

## Token Storage Location
- Tokens are stored in browser's `localStorage`
- Each domain/app stores separately
- Token persists until you logout or clear browser data

## Troubleshooting

If you don't see your token restored:
- Check that `.env` file exists with correct credentials
- Open DevTools (F12) → Application → Local Storage
- Should see `spotify_token` key with your access token
- If missing, complete login process again
