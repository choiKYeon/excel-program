// ESM 방식으로 변경된 electron.js
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path'; // Node.js 모듈도 import로 불러옵니다.

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

app.on('ready', createWindow);
