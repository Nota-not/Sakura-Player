## Sakura Player - Complete Debugging & Testing Guide

### What We've Changed
Added comprehensive console logging to track every step of the OAuth flow and search process. This will help us pinpoint exactly where songs fail to display.

### How to Test

#### Step 1: Start the App
1. Run the Electron app (from main directory: `npm start`)
2. Wait for the window to appear (1200x800 layout)
3. **Open DevTools**: Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
4. Go to the **Console** tab

#### Step 2: Connect with Spotify
1. In the app, click the "Connect with Spotify" button
2. A browser window will open for Spotify login
3. Log in with your Spotify account
4. **CRITICAL**: Watch the browser window for success message "✓ Login successful!"
5. Look at DevTools Console - you should see:
   ```
   === AUTH MESSAGE DEBUG ===
   1. Received message: {type: 'auth_success', token: 'BQC...'}
   2. Message type: auth_success
   3. Auth success! Token received
   4. Token stored in memory: true
   5. Token preview: BQC...
   6. Token stored in localStorage: true
   7. Verify localStorage: true
   8. Auth window closed
   9. App shown
   10. Spotify player initialized
   === END AUTH DEBUG ===
   ```
   **If you don't see this, the OAuth callback is failing**

#### Step 3: Test Search
1. Click the "Search" nav item (left sidebar)
2. Enter a song name (e.g., "Hello")
3. Click the search button
4. **Watch the DevTools Console** - you should see:
   ```
   === SEARCH DEBUG ===
   1. Query: Hello
   2. Frontend token in memory: true
   3. Frontend token in localStorage: true
   4. Backend URL: http://127.0.0.1:8888
   5. Full search URL: http://127.0.0.1:8888/search?q=Hello
   6. Response status: 200
   7. Response OK? true
   8. Response data: {tracks: {items: [...]}}
   9. Tracks found: 15
   === END DEBUG ===
   ```
   **If status is not 200, note the error code and message**

#### Step 4: Check Backend Console
1. Look at the terminal/console where you started `npm start`
2. You should see similar logs from the backend:
   ```
   === BACKEND TOKEN DEBUG ===
   1. Token exchange successful
   2. Access token stored: true
   3. Token preview: BQC...
   4. Refresh token stored: false
   === END TOKEN DEBUG ===
   
   Search query: Hello with token: BQC...
   Search successful, found: 15 tracks
   ```

### Expected vs Actual

#### If songs DO display:
✅ **SUCCESS** - Everything is working! 
- You should see a grid of songs with names and artists
- Clicking a song should add it to the queue
- This means the system is functioning correctly

#### If songs DON'T display:

**Scenario A: "No access token available" error (401)**
- Problem: Backend never received token from OAuth
- Check: Did you see the "✓ Login successful!" message in browser?
- Solution: Try logging in again, make sure callback window closes properly

**Scenario B: Status 403 (Forbidden)**
- Problem: Spotify API rejected the token
- Possible causes:
  - Token expired (unlikely on fresh login)
  - Token is invalid
  - Spotify API rate limited
- Solution: Try logging out and back in

**Scenario C: Status 200 but 0 tracks found**
- Problem: Search query is sending but returning no results
- Check: Is your query spelled correctly?
- Solution: Try different song names (e.g., "Hello", "Never Gonna Give You Up", "Bohemian Rhapsody")

**Scenario D: No logs appearing at all**
- Problem: JavaScript might not be running
- Check:
  - Are you in the right view (Search tab)?
  - Are you clicking the search button?
  - Is there a JavaScript error (red text in console)?
- Solution: 
  - Try refreshing the app (`Ctrl+R` or `Cmd+R`)
  - Check for red error messages in console

### Debug Checklist

- [ ] DevTools Console is open when testing
- [ ] You successfully logged into Spotify (saw "✓ Login successful!")
- [ ] You searched for a common song (e.g., "Hello")
- [ ] You took note of the response status (200, 401, 403, etc.)
- [ ] You checked backend console for token storage messages
- [ ] You have the full console output to share if reporting issues

### What to Report If It Doesn't Work

Please provide:
1. Full console output from the app (AUTH DEBUG + SEARCH DEBUG sections)
2. Full console output from backend (BACKEND TOKEN DEBUG + Search error messages)
3. The exact error message/status code
4. Steps you took (which button clicked, what you searched for)
5. Screenshots of the console if possible

### Files That Were Modified for Debugging

- **script.js**: Added detailed logging to:
  - Authentication flow (`window.addEventListener("message")`)
  - Search function (`searchSpotify()`)
  - Recommendations function (`loadRecommendations()`)

- **server.js**: Added detailed logging to:
  - Token storage from OAuth callback

These logs will help us identify exactly where the problem is if songs still don't appear.
