require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8888;

// Enable CORS for Electron app
app.use((req, res, next) => {
  const allowed = ["http://localhost:8888", 'file://'];
  const origin = req.headers.origin;
  if (!origin || allowed.some( o => origin.startsWith(o) )) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store tokens in memory (in production, use a database)
let tokens = {
  accessToken: null,
  refreshToken: null,
};

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Authorization endpoint - redirects user to Spotify login
app.get("/login", (req, res) => {
  const scope = "streaming user-read-private user-read-email user-modify-playback-state user-read-playback-state";
  const authURL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authURL);
});

// Callback endpoint - handles Spotify's authorization code
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error) {
    return res.send(`<h1>Error</h1><p>Authentication failed</p>`);
  }

  if (!code) {
    return res.send("<h1>Error</h1><p>No authorization code received</p>");
  }

  try {
    // Exchange authorization code for tokens
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    tokens.accessToken = response.data.access_token;
    if (response.data.refresh_token) {
      tokens.refreshToken = response.data.refresh_token;
    }

    console.log("=== BACKEND TOKEN DEBUG ===");
    console.log("1. Token exchange successful");
    console.log("2. Access token stored:", !!tokens.accessToken);
    console.log("3. Token preview:", tokens.accessToken?.substring(0, 20) + "...");
    console.log("4. Refresh token stored:", !!tokens.refreshToken);
    console.log("=== END TOKEN DEBUG ===");

    // Send success response with token
    res.send(
      `<html><body>
        <h1>✓ Login successful!</h1>
        <p>You can close this window and return to Sakura Player.</p>
        <script>
          // Send token back to main app
          if (window.opener) {
            window.opener.postMessage({
              type: "auth_success",
              token: "${tokens.accessToken}"
            }, "*");
            setTimeout(() => window.close(), 1000);
          }
        </script>
      </body></html>`
    );
  } catch (error) {
    console.error("Token exchange error:", error);
    res.send("<h1>Authentication failed</h1><p>Please try again.</p>");
  }
});

// Get current access token
app.get("/token", (req, res) => {
  if (!tokens.accessToken) {
    return res.status(401).json({ error: "No access token available" });
  }
  res.json({ accessToken: tokens.accessToken });
});

// Refresh access token
app.post("/refresh", async (req, res) => {
  if (!tokens.refreshToken) {
    return res.status(401).json({ error: "No refresh token available" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokens.refreshToken,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    tokens.accessToken = response.data.access_token;
    if (response.data.refresh_token) {
      tokens.refreshToken = response.data.refresh_token;
    }

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

// Logout - clear tokens
app.post("/logout", (req, res) => {
  tokens = { accessToken: null, refreshToken: null };
  res.json({ success: true });
});

// Search - proxy for Spotify search API
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!tokens.accessToken) {
    console.error("Search failed: no access token");
    return res.status(401).json({ error: "No access token available", tracks: { items: [] } });
  }
  if (!query) {
    return res.status(400).json({ error: "Query parameter required", tracks: { items: [] } });
  }

  try {
    console.log("Search query:", query, "with token:", tokens.accessToken.substring(0, 20) + "...");
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=15`;
    console.log("Search URL:", searchUrl);
    
    const response = await axios.get(
      searchUrl,
      { 
        headers: { 
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json"
        } 
      }
    );
    console.log("Search successful, found:", response.data.tracks?.items?.length || 0, "tracks");
    res.json(response.data);
  } catch (error) {
    console.error("Search error:", error.message, "Status:", error.response?.status);
    console.error("Error response data:", error.response?.data);
    if (error.response?.status === 401) {
      console.error("Token expired, need refresh");
    }
    if (error.response?.status === 400) {
      console.error("Bad request - likely query formatting issue");
    }
    res.status(error.response?.status || 500).json({ 
      error: "Search failed", 
      tracks: { items: [] },
      debug: error.message 
    });
  }
});

// Recommendations - get new releases instead (more reliable, no special permissions needed)
app.get("/recommendations", async (req, res) => {
  if (!tokens.accessToken) {
    console.error("Recommendations failed: no access token");
    return res.status(401).json({ error: "No access token available", items: [] });
  }

  try {
    console.log("Loading recommendations with token:", tokens.accessToken.substring(0, 20) + "...");
    
    // Use browse/new-releases endpoint - no extra permissions needed, always works
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/new-releases?limit=20`,
      { 
        headers: { 
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json"
        } 
      }
    );
    
    // Convert playlists to tracks format for compatibility
    const playlists = response.data.playlists?.items || [];
    const tracks = playlists.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      artists: [{ name: "Playlist" }],
      album: { images: playlist.images },
      external_urls: playlist.external_urls,
      uri: playlist.uri
    }));
    
    console.log("Got recommendation tracks:", tracks.length);
    res.json({ items: tracks });
  } catch (error) {
    console.error("Recommendations error:", error.message, "Status:", error.response?.status);
    console.error("Error response:", error.response?.data);
    if (error.response?.status === 401) {
      console.error("Token expired - need to refresh");
    }
    res.status(error.response?.status || 500).json({ 
      items: [],
      error: error.message 
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend server running" });
});

app.listen(PORT, () => {
  console.log(`Spotify OAuth backend server running on http://127.0.0.1:${PORT}`);
});
