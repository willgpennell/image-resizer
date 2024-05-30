// main.js is the backend file of electron
// within backend files you can import any node module, however within the renderer you can only import files with a preload file

const path = require("path");
const { app, BrowserWindow } = require("electron");

// checks if current platform is mac
const isMac = process.platform === "darwin";

// creates main window function, with title and dimensions
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: 500,
    height: 600,
  });

  // mainwindow will display this file
  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

// when the window has been loaded return a promise which then calls the mainwindow function
app.whenReady().then(() => {
  createMainWindow();

  // " activate emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time, attempting to re-launch the application when it's already running, or clicking on the application's dock or taskbar icon."
  // also for mac when there is no windows open, open another one
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// respects mac's standard where apps don't close until you cmd+q
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
