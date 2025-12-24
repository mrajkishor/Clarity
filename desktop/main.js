const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false
  });

  const indexPath = app.isPackaged
    ? path.join(process.resourcesPath, "app.asar", "dist", "index.html")
    : path.join(__dirname, "../dist/index.html");

  win.loadFile(indexPath);

  win.once("ready-to-show", () => {
    win.show();
  });
}

app.whenReady().then(createWindow);
