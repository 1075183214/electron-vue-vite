// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false,
    maximizable: false,
    title: "百度地图工具",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // vite 构建后使用静态文件地址，否则使用启动的服务器地址
  const URL = app.isPackaged
    ? path.join(__dirname, "src/dist/index.html")
    : "http://localhost:3000";
  console.log(URL);
  app.isPackaged ? mainWindow.loadFile(URL) : mainWindow.loadURL(URL);
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

/**
 * 监听消息
 */
ipcMain.on("synchronous-message", (event, arg) => {
  const path = dialog.showOpenDialogSync(mainWindow, {
    properties: ["openDirectory"],
  });
  event.returnValue = path;
});
