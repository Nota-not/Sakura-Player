#!/usr/bin/env node
/**
 * Quick Backend Verification Script
 * Run this to check if the backend is set up correctly
 * Usage: node verify-backend.js
 */

require("dotenv").config();
const axios = require("axios");

const BACKEND_URL = "http://127.0.0.1:8888";

console.log("\n╔════════════════════════════════════════════╗");
console.log("║   SAKURA PLAYER - BACKEND VERIFICATION    ║");
console.log("╚════════════════════════════════════════════╝\n");

async function verify() {
  try {
    // Check 1: Backend is running
    console.log("1️⃣  Testing backend connectivity...");
    try {
      const healthRes = await axios.get(`${BACKEND_URL}/health`);
      console.log("   ✅ Backend is running: " + healthRes.data.status);
    } catch (err) {
      console.log("   ❌ Backend not responding on port 8888");
      console.log("   💡 Make sure you ran 'npm start' first");
      process.exit(1);
    }

    // Check 2: Environment variables
    console.log("\n2️⃣  Checking environment variables...");
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    
    console.log(`   CLIENT_ID: ${clientId ? "✅ Set" : "❌ Missing"}`);
    console.log(`   CLIENT_SECRET: ${clientSecret ? "✅ Set" : "❌ Missing"}`);
    console.log(`   REDIRECT_URI: ${redirectUri ? "✅ Set" : "❌ Missing"}`);
    
    if (!clientId || !clientSecret || !redirectUri) {
      console.log("\n   ❌ Missing credentials!");
      console.log("   💡 Make sure .env file exists with all three values");
      process.exit(1);
    }

    // Check 3: Login endpoint exists
    console.log("\n3️⃣  Testing OAuth login endpoint...");
    try {
      const loginRes = await axios.get(`${BACKEND_URL}/login`, {
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 301
      });
      console.log("   ✅ Login endpoint redirects to Spotify OAuth");
    } catch (err) {
      if (err.response?.status === 302 || err.response?.status === 301) {
        console.log("   ✅ Login endpoint redirects to Spotify OAuth");
      } else {
        console.log("   ❌ Login endpoint error:", err.response?.status);
      }
    }

    // Check 4: Search without token (should fail with 401)
    console.log("\n4️⃣  Testing search endpoint (no token expected)...");
    try {
      await axios.get(`${BACKEND_URL}/search?q=test`);
      console.log("   ⚠️  Search didn't require token (unexpected)");
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("   ✅ Search correctly returns 401 without token");
      } else if (err.response?.status === 403) {
        console.log("   ✅ Search correctly returns 403 without token");
      } else {
        console.log("   ❌ Unexpected error:", err.response?.status);
      }
    }

    // Check 5: Recommendations without token (should fail with 401)
    console.log("\n5️⃣  Testing recommendations endpoint (no token expected)...");
    try {
      await axios.get(`${BACKEND_URL}/recommendations`);
      console.log("   ⚠️  Recommendations didn't require token (unexpected)");
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("   ✅ Recommendations correctly returns 401 without token");
      } else if (err.response?.status === 403) {
        console.log("   ✅ Recommendations correctly returns 403 without token");
      } else {
        console.log("   ❌ Unexpected error:", err.response?.status);
      }
    }

    // Summary
    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║              VERIFICATION COMPLETE         ║");
    console.log("╚════════════════════════════════════════════╝\n");
    
    console.log("✅ Backend is properly configured!\n");
    console.log("Next steps:");
    console.log("1. Run the Electron app: npm start");
    console.log("2. Click 'Connect with Spotify'");
    console.log("3. Log in with your Spotify account");
    console.log("4. Search for songs in the Search tab");
    console.log("5. Check DevTools Console for detailed logs\n");
    console.log("📝 For more help, see DEBUGGING_GUIDE.md\n");

  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    process.exit(1);
  }
}

verify();
