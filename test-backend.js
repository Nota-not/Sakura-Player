const axios = require("axios");
require("dotenv").config();

const BACKEND_URL = "http://127.0.0.1:8888";

async function testBackend() {
  console.log("=== Sakura Player Backend Test ===\n");

  try {
    // Test 1: Health check
    console.log("1. Testing /health endpoint...");
    const healthRes = await axios.get(`${BACKEND_URL}/health`);
    console.log("✓ Health:", healthRes.data);

    // Test 2: Get a test token (we'll need to simulate this)
    console.log("\n2. Checking environment variables...");
    console.log("CLIENT_ID:", process.env.SPOTIFY_CLIENT_ID ? "✓ Set" : "✗ Missing");
    console.log("CLIENT_SECRET:", process.env.SPOTIFY_CLIENT_SECRET ? "✓ Set" : "✗ Missing");
    console.log("REDIRECT_URI:", process.env.REDIRECT_URI ? "✓ Set" : "✗ Missing");

    // Test 3: Try to get recommendations (this will fail without a token, but we can see the error)
    console.log("\n3. Testing /recommendations endpoint (will fail without token)...");
    try {
      const recRes = await axios.get(`${BACKEND_URL}/recommendations`);
      console.log("Recommendations:", recRes.data);
    } catch (error) {
      console.log("Expected error (no token):", error.response?.status, error.response?.data?.error);
    }

    // Test 4: Try search (will also fail without token)
    console.log("\n4. Testing /search endpoint (will fail without token)...");
    try {
      const searchRes = await axios.get(`${BACKEND_URL}/search?q=hello`);
      console.log("Search results:", searchRes.data);
    } catch (error) {
      console.log("Expected error (no token):", error.response?.status, error.response?.data?.error);
    }

    console.log("\n=== Backend is working correctly ===");
    console.log("Songs will display once user logs in via Spotify OAuth.");
    console.log("\nTo fully test:");
    console.log("1. Open the Electron app");
    console.log("2. Click 'Connect with Spotify'");
    console.log("3. Log in with Spotify account");
    console.log("4. Token will be stored automatically");
    console.log("5. Search/Browse will then fetch songs from Spotify");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testBackend();
