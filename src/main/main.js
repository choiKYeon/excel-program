// // main.js
// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
// const exec = require("child_process").exec;
// // const isDev = require("electron-is-dev");
// // electron-is-dev 모듈을 동적 import로 가져오기
// const isDev = import("electron-is-dev").then((module) => module.default);

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1500,
//     height: 1000,
//     minWidth: 1500, // 창의 최소 너비 설정
//     minHeight: 1000, // 창의 최소 높이 설정
//     resizable: false, // 창 크기 변경 불가
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//       contextIsolation: true,
//       nodeIntegration: false,
//     },
//   });

//   // 세션 데이터와 캐시를 초기화
//   mainWindow.webContents.session.clearCache();
//   mainWindow.webContents.session.clearStorageData();

//  // 개발 모드와 프로덕션 모드에 따라 URL 설정
//  const startUrl = isDev
//  ? "http://localhost:3000/login"  // 개발 모드: 로컬 서버
//  : "http://localhost:3000/login"; // 프로덕션 모드: 동적 Next.js 서버 사용

// // 프로덕션 모드에서 Next.js 서버 실행
// if (!isDev) {
//  exec("npm run start:electron", (err, stdout, stderr) => {
//    if (err) {
//      console.error(`로컬 서버 실행 오류: ${stderr}`);
//      return;
//    }
//    console.log(stdout);
//    mainWindow.loadURL(startUrl);
//  });
// } else {
//  mainWindow.loadURL(startUrl);
// }

// mainWindow.on("closed", () => {
//  mainWindow = null;
// });
// }

// app.on("ready", createWindow);

// app.on("window-all-closed", () => {
// if (process.platform !== "darwin") {
//  app.quit();
// }
// });

// app.on("activate", () => {
// if (BrowserWindow.getAllWindows().length === 0) {
//  createWindow();
// }
// });


// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const exec = require("child_process").exec;
exec("npm run start", (err, stdout, stderr) => {
  console.log(stdout);
});
// const isDev = require("electron-is-dev");
// electron-is-dev 모듈을 동적 import로 가져오기
const isDev = import("electron-is-dev").then((module) => module.default);

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
