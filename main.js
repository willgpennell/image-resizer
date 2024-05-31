// main.js is the backend file of electron
// within backend files you can import any node module, however within the renderer you can only import files with a preload file

const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");

// check if application is being run in development mode
const isDev = process.env.NODE_ENV !== "development";

// checks if current platform is mac
const isMac = process.platform === "darwin";

// creates main window function, with title and dimensions
function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 600,
  });

  // if developer mode active, open developer tools right away
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // mainwindow will display this file
  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About",
    width: 300,
    height: 300,
  });

  // mainwindow will display this file
  aboutWindow.loadFile(path.join(__dirname, "./renderer/about.html"));
}

// create about window

// when the window has been loaded return a promise which then calls the mainwindow function
app.whenReady().then(() => {
  createMainWindow();

  // set menu for this window as the one defined below
  const MainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(MainMenu);

  // " activate emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time, attempting to re-launch the application when it's already running, or clicking on the application's dock or taskbar icon."
  // also for mac when there is no windows open, open another one
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// menu definition
const menu1 = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+w",
      },
    ],
  },
];

const menu = [
  //respect macs standard of having app name as first menu item
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  //respect windows standard of having Help menu as last menu item
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];

// respects mac's standard where apps don't close until you cmd+q
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
