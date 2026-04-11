# 🎵 Sakura Player - Tester Setup Guide

Welcome! You've been asked to test the **Sakura Player** app. This guide walks you through everything you need to do.

## Prerequisites

- ✅ Node.js installed (download from https://nodejs.org if needed)
- ✅ Spotify account (free or premium)
- ✅ Git installed (or ability to download ZIP)

## Installation (5 Minutes)

### Option A: Using Git (Recommended)

```bash
# Clone the project
git clone https://github.com/YOUR_USERNAME/sakura-player.git
cd sakura-player

# Install dependencies
npm install

# Verify setup
node verify-backend.js
```

### Option B: Download ZIP

1. Go to the GitHub repo
2. Click green **Code** button
3. Click **Download ZIP**
4. Extract the ZIP
5. Open terminal in the folder
6. Run:
   ```bash
   npm install
   node verify-backend.js
   ```

## Spotify Setup (2 Minutes)

1. **Create `.env` file** in the project root folder with:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   REDIRECT_URI=http://127.0.0.1:8888/callback
   ```

2. **Get your credentials**:
   - Go to https://developer.spotify.com/dashboard
   - Log in with your Spotify account
   - Create an app
   - Copy **Client ID**
   - Copy **Client Secret**
   - In Settings, add Redirect URI: `http://127.0.0.1:8888/callback`
   - Paste these into the `.env` file

## Running the App

```bash
npm start
```

You should see:
- ✅ Backend server starting
- ✅ Electron window opening (1200x800)
- ✅ Login screen

## Testing Checklist

### ✅ Test 1: Login
- [ ] Click "Connect with Spotify"
- [ ] Browser opens for Spotify login
- [ ] You log in successfully
- [ ] Button changes to "Log Out"

### ✅ Test 2: Search
- [ ] Click "Search" in sidebar
- [ ] Enter a song name (try "Hello", "Blinding Lights", "Never Gonna Give You Up")
- [ ] Click search button
- [ ] Results appear in a grid
- [ ] Click a song, it adds to queue

### ✅ Test 3: Browse
- [ ] Click "Browse" in sidebar
- [ ] Recommended tracks appear
- [ ] Click a song, it adds to queue

### ✅ Test 4: Queue
- [ ] Click "Queue" in sidebar
- [ ] See songs you added
- [ ] Click a song to select it

### ✅ Test 5: Now Playing
- [ ] Click "Now Playing"
- [ ] See the selected track info
- [ ] See playback controls

## Debugging (If Something Breaks)

### **Open DevTools Console**
- Windows/Linux: `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`
- Click **Console** tab

### **Check for Detailed Logs**
When you search or login, look for:
```
=== AUTH MESSAGE DEBUG ===
=== SEARCH DEBUG ===
=== RECOMMENDATIONS DEBUG ===
```

These logs show exactly what's happening.

### **Report Issues**
If something doesn't work:
1. **Note the exact error message** from the console
2. **Try the test again** (sometimes it's a network issue)
3. **Report in GitHub Issues** with:
   - What you tried
   - What happened
   - Screenshot of console error (if any)
   - Your OS and Node.js version

## Common Issues

### "Backend not responding"
```bash
# In another terminal, check if port 8888 is in use:
lsof -i :8888  # Mac/Linux
netstat -ano | findstr :8888  # Windows
```

### "No Spotify credentials"
- Make sure `.env` file exists
- Check file has exactly 3 lines:
  ```
  SPOTIFY_CLIENT_ID=abc123
  SPOTIFY_CLIENT_SECRET=xyz789
  REDIRECT_URI=http://127.0.0.1:8888/callback
  ```

### "Search returns no results"
- Try common songs: "Hello", "Blinding Lights"
- Check internet connection
- Try logging out and back in

### "Can't connect to Spotify"
- Spotify might be down (rare)
- Try in a few minutes
- Check your internet

## Reporting Bugs

When you find an issue:

1. **Go to GitHub Issues**: https://github.com/YOUR_USERNAME/sakura-player/issues
2. **Click "New Issue"**
3. **Describe**:
   - What you did
   - What happened
   - What you expected
   - Your OS/Node version
   - Screenshot of any errors

### Example Bug Report:
```
**Title**: Search not displaying results

**What I did**: Searched for "Hello"

**What happened**: Console shows 200 response but no songs appear

**Expected**: See grid of "Hello" by Adele songs

**Console error**: [paste error from console]

**OS**: Mac, Node.js 16.13
```

## FAQ

**Q: Do I need Spotify Premium?**  
A: No, free account works fine.

**Q: Is my Spotify password secure?**  
A: Yes! The `.env` file is listed in `.gitignore`, so it never uploads to GitHub. Only you see your credentials.

**Q: Can I share this with friends?**  
A: Yes! They should:
1. Clone the repo
2. Create their own `.env` with their Spotify credentials
3. Run `npm install` and `npm start`

**Q: What if the app crashes?**  
A: Check the console for error messages. Report it with the error in GitHub Issues.

**Q: Can I use this to play music?**  
A: The Spotify SDK is integrated, but full playback requires setup. For now, focus on testing search and recommendations.

## Helpful Documentation

- `README_COMPLETE.md` - Full feature list and troubleshooting
- `DEBUGGING_GUIDE.md` - Detailed debugging steps
- `QUICK_REFERENCE.md` - 2-minute overview

## Questions?

Ask the developer or check the GitHub Issues!

---

**Thank you for testing Sakura Player! 🎵**

Your feedback helps make this app better.
