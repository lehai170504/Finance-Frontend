const { app, BrowserWindow } = require("electron");
const path = require("path");
const serve = require("electron-serve");

// Tự định nghĩa isDev dựa trên việc app đã được đóng gói hay chưa
const isDev = !app.isPackaged;

const serveFunc = typeof serve === 'function' ? serve : (serve.default || serve);
const loadURL = serveFunc({ directory: path.join(__dirname, "../out") });

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 832,
    autoHideMenuBar: true,
    backgroundColor: "#0a0a0a",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../public/icon.png"),
    title: "WealthTrack",
    // Giả lập User Agent của Chrome để Google cho phép đăng nhập
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // Trong bản build, loadURL sẽ tự động tìm đến thư mục out
    loadURL(mainWindow);
    // Tạm thời để mở DevTools để ông kiểm tra, sau này chạy ngon thì tắt đi sau
    // mainWindow.webContents.openDevTools(); 
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
