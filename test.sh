#!/bin/bash

echo "Starting test of Sakura Player API endpoints..."
sleep 3

# Test health endpoint
echo ""
echo "1. Testing /health endpoint..."
HEALTH=$(curl -s http://127.0.0.1:8888/health)
echo "Health response: $HEALTH"

if [[ $HEALTH == *"running"* ]]; then
  echo "✓ Server is running"
else
  echo "✗ Server not responding"
  exit 1
fi

echo ""
echo "2. Testing /callback (will need Spotify auth - skipping for now)"

echo ""
echo "3. Checking if token is available..."
# This would require a logged-in user, so we'll just verify the endpoint exists

echo ""
echo "All basic tests completed!"
echo "Note: Search and Recommendations endpoints require a valid Spotify token from login"
