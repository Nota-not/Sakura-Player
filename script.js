// Configuration
const BACKEND_URL = "http://127.0.0.1:8888";

// ─── DOM Elements ────────────────────────────────────────────────────────────
const loginModal = document.getElementById("loginModal");
const playerApp = document.getElementById("playerApp");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Navigation
const navItems = document.querySelectorAll(".nav-item");

// Now Playing View
const trackName = document.getElementById("trackName");
const artistName = document.getElementById("artistName");
const currentTime = document.getElementById("currentTime");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const waveform = document.getElementById("waveform");

// Search View
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

// Browse View
const browseBtn = document.getElementById("browseBtn");
const recommendedResults = document.getElementById("recommendedResults");

// Queue View
const queueList = document.getElementById("queueList");
const clearQueueBtn = document.getElementById("clearQueueBtn");

// ─── State ──────────────────────────────────────────────────────────────────
let accessToken = localStorage.getItem("spotify_token");
let currentPlayer = null;
let deviceId = null;
let queue = [];
let currentQueueIndex = -1;
let isPlaying = false;

// ─── Initialize ─────────────────────────────────────────────────────────────
window.onSpotifyWebPlaybackSDKReady = () => {
  if (!accessToken) return;
  _createPlayer();
};

function initSpotifyPlayer() {
  if (window.Spotify) {
    _createPlayer();
  }
}

function _createPlayer() {
  if (currentPlayer) return;

  currentPlayer = new Spotify.Player({
    name: "Sakura Player",
    getOAuthToken: (cb) => { cb(accessToken); },
    volume: 0.6,
  });

  currentPlayer.addListener("ready", ({ device_id }) => {
    deviceId = device_id;
    console.log("Player ready, device_id:", device_id);
  });

  currentPlayer.addListener("not_ready", ({ device_id }) => {
    console.warn("Device went offline:", device_id);
    deviceId = null;
  });

  currentPlayer.addListener("player_state_changed", (state) => {
    if (!state) return;

    const track = state.track_window?.current_track;
    if (track) {
      trackName.textContent = track.name;
      artistName.textContent = track.artists.map((a) => a.name).join(", ");
    }

    const paused = state.paused;
    setPlayingState(!paused);

    const secs = Math.floor(state.position / 1000);
    const mins = Math.floor(secs / 60);
    const rem = String(secs % 60).padStart(2, "0");
    currentTime.textContent = `${mins}:${rem}`;
  });

  currentPlayer.addListener("initialization_error", ({ message }) => console.error("Init error:", message));
  currentPlayer.addListener("authentication_error", ({ message }) => console.error("Auth error:", message));
  currentPlayer.addListener("account_error", ({ message }) => console.error("Account error:", message));

  currentPlayer.connect();
}

// ─── UI Initialization ──────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  if (accessToken) {
    showApp();
    initSpotifyPlayer();
  }
});

// ─── Login / Logout ─────────────────────────────────────────────────────────
loginBtn.addEventListener("click", () => {
  const authWindow = window.open(
    `${BACKEND_URL}/login`,
    "Spotify Login",
    "width=500,height=600"
  );

  window.addEventListener("message", function handler(event) {
    console.log("=== AUTH MESSAGE DEBUG ===");
    console.log("1. Received message:", event.data);
    console.log("2. Message type:", event.data?.type);
    
    if (event.data.type === "auth_success") {
      console.log("3. Auth success! Token received");
      accessToken = event.data.token;
      console.log("4. Token stored in memory:", !!accessToken);
      console.log("5. Token preview:", accessToken?.substring(0, 20) + "...");
      
      localStorage.setItem("spotify_token", accessToken);
      console.log("6. Token stored in localStorage");
      console.log("7. Verify localStorage:", !!localStorage.getItem("spotify_token"));
      
      authWindow?.close();
      console.log("8. Auth window closed");
      
      showApp();
      console.log("9. App shown");
      
      initSpotifyPlayer();
      console.log("10. Spotify player initialized");
      console.log("=== END AUTH DEBUG ===");
      
      window.removeEventListener("message", handler);
    }
  });
});

logoutBtn.addEventListener("click", async () => {
  try {
    await fetch(`${BACKEND_URL}/logout`, { method: "POST" });
  } catch (err) {
    console.error("Logout error:", err);
  }

  if (currentPlayer) {
    currentPlayer.disconnect();
    currentPlayer = null;
  }

  accessToken = null;
  deviceId = null;
  queue = [];
  currentQueueIndex = -1;

  localStorage.removeItem("spotify_token");
  loginModal.style.display = "flex";
  playerApp.style.display = "none";
});

function showApp() {
  loginModal.style.display = "none";
  playerApp.style.display = "flex";
}

// ─── Navigation ─────────────────────────────────────────────────────────────
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Update active nav item
    navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    // Show/hide views
    const viewName = item.dataset.view;
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active");
    });

    const viewId = `${viewName}-view`;
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add("active");

      // Load recommendations on browse view
      if (viewName === "browse" && recommendedResults.innerHTML === "") {
        loadRecommendations();
      }
    }
  });
});

// ─── Play / Pause ───────────────────────────────────────────────────────────
function setPlayingState(playing) {
  isPlaying = playing;
  playBtn.style.display = playing ? "none" : "flex";
  pauseBtn.style.display = playing ? "flex" : "none";
  if (waveform) {
    waveform.classList.toggle("paused", !playing);
  }
}

playBtn.addEventListener("click", () => {
  if (currentPlayer) currentPlayer.resume();
});

pauseBtn.addEventListener("click", () => {
  if (currentPlayer) currentPlayer.pause();
});

prevBtn.addEventListener("click", () => {
  if (queue.length > 0 && currentQueueIndex > 0) {
    currentQueueIndex--;
    playQueueTrack(currentQueueIndex);
  } else if (currentPlayer) {
    currentPlayer.previousTrack();
  }
});

nextBtn.addEventListener("click", () => {
  if (queue.length > 0 && currentQueueIndex < queue.length - 1) {
    currentQueueIndex++;
    playQueueTrack(currentQueueIndex);
  } else if (currentPlayer) {
    currentPlayer.nextTrack();
  }
});

// ─── Search ─────────────────────────────────────────────────────────────────
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (accessToken && query) {
    searchSpotify(query);
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && accessToken && searchInput.value.trim()) {
    searchSpotify(searchInput.value.trim());
  }
});

async function searchSpotify(query) {
  try {
    console.log("=== SEARCH DEBUG ===");
    console.log("1. Query:", query);
    console.log("2. Frontend token in memory:", !!accessToken);
    console.log("3. Frontend token in localStorage:", !!localStorage.getItem("spotify_token"));
    console.log("4. Backend URL:", BACKEND_URL);
    
    const url = `${BACKEND_URL}/search?q=${encodeURIComponent(query)}`;
    console.log("5. Full search URL:", url);
    
    const res = await fetch(url);
    console.log("6. Response status:", res.status);
    console.log("7. Response OK?", res.ok);

    if (!res.ok) {
      console.error("Search API error:", res.status, res.statusText);
      const errorData = await res.json();
      console.error("Error response:", errorData);
      displaySearchResults([]);
      return;
    }

    const data = await res.json();
    console.log("8. Response data:", data);
    console.log("9. Tracks found:", data.tracks?.items?.length ?? 0);
    console.log("=== END DEBUG ===");
    
    displaySearchResults(data.tracks?.items ?? []);
  } catch (err) {
    console.error("Search error:", err);
    console.error("Error stack:", err.stack);
    displaySearchResults([]);
  }
}

function displaySearchResults(tracks) {
  searchResults.innerHTML = "";

  if (tracks.length === 0) {
    searchResults.innerHTML = `<p class="empty-state">No tracks found</p>`;
    return;
  }

  tracks.forEach((track) => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.innerHTML = `
      <div class="result-name">${track.name}</div>
      <div class="result-artist">${track.artists.map((a) => a.name).join(", ")}</div>
    `;
    item.addEventListener("click", () => {
      addToQueue(track);
      searchInput.value = "";
      searchResults.innerHTML = "";
    });
    searchResults.appendChild(item);
  });
}

// ─── Browse / Recommendations ───────────────────────────────────────────────
browseBtn.addEventListener("click", () => {
  console.log("Browse button clicked");
  if (accessToken) {
    recommendedResults.innerHTML = "";
    loadRecommendations();
  }
});

async function loadRecommendations() {
  try {
    console.log("=== RECOMMENDATIONS DEBUG ===");
    console.log("1. Frontend token in memory:", !!accessToken);
    console.log("2. Backend URL:", BACKEND_URL);
    
    const url = `${BACKEND_URL}/recommendations`;
    console.log("3. Full recommendations URL:", url);
    
    const res = await fetch(url);
    console.log("4. Response status:", res.status);
    console.log("5. Response OK?", res.ok);

    if (!res.ok) {
      console.error("Recommendations API error:", res.status, res.statusText);
      const errorData = await res.json();
      console.error("Error response:", errorData);
      displayRecommendations([]);
      return;
    }

    const data = await res.json();
    const tracks = data.items || [];

    console.log("6. Response data:", data);
    console.log("7. Tracks found:", tracks.length);
    console.log("=== END DEBUG ===");
    
    displayRecommendations(tracks);
  } catch (err) {
    console.error("Recommendations error:", err);
    console.error("Error stack:", err.stack);
    displayRecommendations([]);
  }
}

function displayRecommendations(tracks) {
  recommendedResults.innerHTML = "";

  if (tracks.length === 0) {
    recommendedResults.innerHTML = `<p class="empty-state">No recommendations available</p>`;
    return;
  }

  tracks.forEach((track) => {
    const item = document.createElement("div");
    item.className = "result-item";
    item.innerHTML = `
      <div class="result-name">${track.name}</div>
      <div class="result-artist">${track.artists.map((a) => a.name).join(", ")}</div>
    `;
    item.addEventListener("click", () => {
      addToQueue(track);
    });
    recommendedResults.appendChild(item);
  });
}

// ─── Queue Management ───────────────────────────────────────────────────────
function addToQueue(track) {
  queue.push({
    uri: track.uri,
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    id: track.id,
  });
  updateQueueDisplay();
  console.log("Track added to queue:", track.name);
}

function removeFromQueue(index) {
  queue.splice(index, 1);
  if (currentQueueIndex >= queue.length) {
    currentQueueIndex = queue.length - 1;
  }
  updateQueueDisplay();
}

function updateQueueDisplay() {
  queueList.innerHTML = "";

  if (queue.length === 0) {
    queueList.innerHTML = `<p class="empty-state">🌷 Nothing queued yet</p>`;
    return;
  }

  queue.forEach((track, index) => {
    const item = document.createElement("div");
    item.className = "queue-item";
    if (index === currentQueueIndex) {
      item.classList.add("playing");
    }

    item.innerHTML = `
      <div class="qi-info">
        <div class="qi-name">${track.name}</div>
        <div class="qi-artist">${track.artist}</div>
      </div>
      <button class="qi-remove" data-index="${index}">✕</button>
    `;

    item.addEventListener("click", (e) => {
      if (!e.target.classList.contains("qi-remove")) {
        currentQueueIndex = index;
        playQueueTrack(index);
      }
    });

    item.querySelector(".qi-remove").addEventListener("click", () => {
      removeFromQueue(index);
    });

    queueList.appendChild(item);
  });
}

function playQueueTrack(index) {
  if (index < 0 || index >= queue.length) return;

  const track = queue[index];
  if (currentPlayer && deviceId) {
    currentPlayer.play({
      uris: [track.uri],
      device_id: deviceId,
    });
    updateQueueDisplay();
  }
}

clearQueueBtn.addEventListener("click", () => {
  queue = [];
  currentQueueIndex = -1;
  updateQueueDisplay();
});

// ─── Initialize on Page Load ────────────────────────────────────────────────
window.addEventListener("load", () => {
  if (accessToken) {
    showApp();
    initSpotifyPlayer();
  }
});
