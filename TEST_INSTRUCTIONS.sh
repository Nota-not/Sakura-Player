#!/bin/bash

# This script tests the Sakura Player API without needing to log in through Spotify
# It requires manually obtaining a valid Spotify access token

echo "================================================"
echo "Sakura Player API Test Suite"
echo "================================================"
echo ""

# Check if server is running
echo "1. Checking if backend server is running..."
HEALTH=$(curl -s http://127.0.0.1:8888/health)
if [[ $HEALTH == *"running"* ]]; then
  echo "✓ Backend server is running"
else
  echo "✗ Backend server is NOT running"
  exit 1
fi

echo ""
echo "================================================"
echo "To fully test search and recommendations:"
echo "================================================"
echo "1. Open the app GUI (Electron window should be visible)"
echo "2. Click 'Connect with Spotify' button"
echo "3. Log in with your Spotify account"
echo "4. Once logged in, try:"
echo "   - Search for a song (e.g., 'Hello')"
echo "   - Click Browse to see recommendations"
echo "   - Click a song to add to queue"
echo "   - Play songs from the Now Playing view"
echo ""
echo "Check browser console (F12) for any errors"
echo "================================================"
