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


// // main.js
// const { app, BrowserWindow, ipcMain } = require("electron");
// const path = require("path");
// const exec = require("child_process").exec;
// exec("npm run start", (err, stdout, stderr) => {
//   console.log(stdout);
// });
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

//   mainWindow.loadURL("http://localhost:3000/login");

//   // 세션 데이터와 캐시를 초기화
//   mainWindow.webContents.session.clearCache();
//   mainWindow.webContents.session.clearStorageData();

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// app.on("ready", createWindow);

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });


// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const exec = require("child_process").exec;

let mainWindow;

// Next.js 서버를 실행하는 함수
function startNextServer() {
  return new Promise((resolve, reject) => {
    const nextServer = exec("npm run start", { cwd: path.join(__dirname, "..") }, (err, stdout, stderr) => {
      if (err) {
        console.error(`Next.js 서버 시작 오류: ${stderr}`);
        reject(err);
      } else {
        console.log(stdout);
        resolve();  // 서버 실행 완료 시 resolve 호출
      }
    });

    // 서버가 이미 실행된 상태인지 주기적으로 체크
    const checkServer = setInterval(() => {
      exec("curl -I http://localhost:3000", (error, stdout) => {
        if (stdout && stdout.includes("200 OK")) {
          clearInterval(checkServer);  // 서버가 준비되면 체크를 멈춤
          resolve();
        }
      });
    }, 1000);  // 1초마다 서버 상태 확인
  });
}

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

app.on("ready", () => {
  try {
    startNextServer();  // 비동기적으로 Next.js 서버 시작 및 준비 확인
    createWindow();           // 서버가 준비된 후 Electron 창 생성
  } catch (err) {
    console.error("Next.js 서버를 시작할 수 없습니다.");
    app.quit();
  }
});

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
