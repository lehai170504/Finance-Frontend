const { app, BrowserWindow } = require("electron");
const path = require("path");
const serve = require("electron-serve");
const isDev = require("electron-is-dev");

// Fix lỗi ESM: Một số phiên bản electron-serve yêu cầu .default
const serveFunc = typeof serve === 'function' ? serve : (serve.default || serve);
const loadURL = serveFunc({ directory: "out" });

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 832,
    autoHideMenuBar: true,
    backgroundColor: "#0a0a0a",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../public/app-icon.ico"),
    title: "Homie Finance",
  });

  mainWindow.setMenu(null);

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    loadURL(mainWindow);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
