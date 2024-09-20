// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Electron과 Next.js 간의 안전한 IPC 통신을 위한 API 노출
contextBridge.exposeInMainWorld('electron', {
  loginSuccess: () => ipcRenderer.send('login-success'),
});
