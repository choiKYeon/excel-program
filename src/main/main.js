// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// electron-is-dev 모듈을 동적 import로 가져오기
const isDev = import('electron-is-dev').then(module => module.default);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,  // 창의 최소 너비 설정
    minHeight: 700, // 창의 최소 높이 설정
    resizable: false,  // 창 크기 변경 불가
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 개발 모드와 프로덕션 모드에 따라 URL 설정
  isDev.then((dev) => {
    mainWindow.loadURL(
      dev
        ? 'http://localhost:3000/login'
        : `file://${path.join(__dirname, '../renderer/out/login.html')}`
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('login-success', () => {
  if (mainWindow) {
    isDev.then((dev) => {
      mainWindow.loadURL(
        dev
          ? 'http://localhost:3000/main'
          : `file://${path.join(__dirname, '../renderer/out/main.html')}`
      );
    });
  }
});
