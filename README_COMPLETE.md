# Sakura Player - Music Desktop App

A Spotify-integrated desktop music player built with Electron, featuring search, recommendations, and queue management.

## Features

✅ **OAuth Authentication** - Secure Spotify login  
✅ **Search** - Find songs by name  
✅ **Recommendations** - Browse featured playlists  
✅ **Queue Management** - Create and manage playback queue  
✅ **Modern UI** - Spotify-inspired sidebar layout (1200x800)  
✅ **Persistent Login** - Token stored locally for convenience  

## Quick Start

### Prerequisites
- Node.js (v14+)
- npm
- Spotify account

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** with Spotify credentials:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   REDIRECT_URI=http://127.0.0.1:8888/callback
   ```

   To get credentials:
   - Go to https://developer.spotify.com/dashboard
   - Create an app
   - Copy Client ID and Secret
   - Add `http://127.0.0.1:8888/callback` as a Redirect URI

3. **Verify backend setup**:
   ```bash
   node verify-backend.js
   ```

4. **Start the app**:
   ```bash
   npm start
   ```

## How to Use

### Login
1. Click **"Connect with Spotify"** button
2. Complete Spotify login in the popup window
3. Return to the app - you're logged in!

### Search for Music
1. Click **"Search"** in the sidebar
2. Enter a song name (e.g., "Hello", "Bohemian Rhapsody")
3. Click the search button
4. Browse results in the grid
5. Click any song to add it to your queue

### Browse Recommendations
1. Click **"Browse"** in the sidebar
2. View featured playlists and tracks
3. Click songs to add to your queue

### Manage Queue
1. Click **"Queue"** in the sidebar
2. See all songs you've queued
3. Click a song to play it
4. Use play/pause controls in the "Now Playing" section

### Now Playing
1. Click **"Now Playing"** in the sidebar
2. Control playback with play/pause/next/previous buttons
3. View current track info

## File Structure

```
├── main.js              # Electron app entry point
├── server.js            # Express backend for OAuth & Spotify API
├── script.js            # Frontend JavaScript
├── index.html           # UI layout
├── styles.css           # Styling
├── package.json         # Dependencies
├── .env                 # Spotify credentials (create this)
├── verify-backend.js    # Backend verification tool
└── DEBUGGING_GUIDE.md   # Detailed debugging instructions
```

## If Songs Don't Display

**First, verify the backend is running**:
```bash
node verify-backend.js
```

**Then check the DevTools Console**:
1. Open DevTools: `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac)
2. Go to **Console** tab
3. Try searching - watch for detailed logs

**Common Issues**:

| Problem | Solution |
|---------|----------|
| "No access token" | Try logging in again |
| 403 Forbidden error | Token might be invalid - logout and login |
| No logs appear | Make sure DevTools is open and you're in Search tab |
| 0 tracks found | Try different song names or check your internet |

**For detailed debugging**: See `DEBUGGING_GUIDE.md`

## Architecture

### Frontend (Electron App)
- **main.js**: Electron window manager + backend launcher
- **script.js**: UI logic, search, queue, player controls
- **index.html**: Layout structure
- **styles.css**: Spotify-inspired styling

### Backend (Express Server)
- **server.js**: 
  - OAuth callback handler
  - Spotify API proxy (`/search`, `/recommendations`)
  - Token management
  - Health check endpoint

### Flow
```
User Login → Spotify OAuth → Backend receives token → 
Frontend stored token locally → Search uses backend token → 
Backend queries Spotify → Results sent to frontend → 
Frontend displays songs
```

## Troubleshooting

### App Won't Start
```bash
# Make sure port 8888 is available
# If port is in use, kill the process:
lsof -i :8888  # Show process using port 8888
kill -9 <PID>   # Kill the process
```

### Backend Not Connecting
```bash
# Check if backend is running
node verify-backend.js

# Manual test
curl http://127.0.0.1:8888/health
```

### Search Returns No Results
1. Make sure you're logged in (should see "Log Out" button)
2. Try common song names: "Hello", "Blinding Lights", "As It Was"
3. Check the backend console for Spotify API errors
4. Verify your Spotify account is active

### Token Expired
- Logout and login again: Click "Log Out" button then "Connect with Spotify"

## Development

### Add a Feature
1. Backend changes → `server.js`
2. Frontend changes → `script.js` + `index.html`/`styles.css`
3. Test with: `npm start`

### Debug
- Frontend: Open DevTools (`Ctrl+Shift+I` / `Cmd+Option+I`)
- Backend: Check terminal output where you ran `npm start`

### Format Code
```bash
npm install prettier --save-dev
npx prettier --write .
```

## API Endpoints

All endpoints run on `http://127.0.0.1:8888`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | GET | Redirects to Spotify OAuth |
| `/callback` | GET | OAuth callback (auto) |
| `/search?q=` | GET | Search Spotify for tracks |
| `/recommendations` | GET | Get featured playlists |
| `/logout` | POST | Clear stored tokens |
| `/health` | GET | Backend status check |

## Spotify API Rate Limits

- Requests are limited to prevent abuse
- If you get 429 errors, wait before retrying
- Free tier limits: ~180,000 requests/month

## Notes

- Tokens are stored in memory on backend (lost on restart)
- Frontend token is persistent via localStorage
- Refresh tokens not currently implemented
- Playback requires active Spotify Premium or Free account

## Support

If songs still don't appear:
1. Follow the debugging guide: `DEBUGGING_GUIDE.md`
2. Run verification: `node verify-backend.js`
3. Check DevTools console logs
4. Verify Spotify credentials in `.env`

---

**Happy listening! 🎵**
