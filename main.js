const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let serverProcess = null;

function startBackendServer() {
  const serverPath = path.join(__dirname, "server.js");
  serverProcess = spawn("node", [serverPath], {
    stdio: "inherit",
    detached: false,
  });

  serverProcess.on("error", (error) => {
    console.error("Failed to start backend server:", error);
  });

  // Wait for server to be ready with retry logic
  return waitForServer(10, 500); // 10 retries, 500ms each
}

function waitForServer(retries, delay) {
  return new Promise((resolve, reject) => {
    const tryConnect = (attemptsLeft) => {
      fetch("http://127.0.0.1:8888/health")
        .then(() => {
          console.log("Backend server is ready");
          resolve();
        })
        .catch(() => {
          if (attemptsLeft > 0) {
            setTimeout(() => tryConnect(attemptsLeft - 1), delay);
          } else {
            reject(new Error("Failed to connect to backend server"));
          }
        });
    };
    tryConnect(retries);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false, 
    transparent: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    }
  });

  win.loadFile("index.html");
}

app.whenReady().then(async () => {
  try {
    await startBackendServer();
    createWindow();
  } catch (error) {
    console.error("Error starting app:", error);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  // Kill backend server
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});