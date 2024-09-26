// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const exec = require("child_process").exec;
exec("npm run start", (err, stdout, stderr) => {
  console.log(stdout);
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    minWidth: 1500, // 창의 최소 너비 설정
    minHeight: 1000, // 창의 최소 높이 설정
    resizable: false, // 창 크기 변경 불가
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000/login");

  // 세션 데이터와 캐시를 초기화
  mainWindow.webContents.session.clearCache();
  mainWindow.webContents.session.clearStorageData();

  mainWindow.on("closed", () => {
    mainWindow = null;
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
