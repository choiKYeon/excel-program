const { app, BrowserWindow } = require("electron");
const path = require("path");

// 동적 import로 electron-is-dev 가져오기
const isDev = async () => (await import("electron-is-dev")).default;

// 브라우저 창을 생성하는 함수
async function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devMode = await isDev();

  win.loadURL(
    devMode
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../renderer/out/index.html")}`
  );

  if (devMode) {
    win.webContents.openDevTools();
  }

  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
