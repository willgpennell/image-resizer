// main.js is the backend file of electron
// within backend files you can import any node module, however within the renderer you can only import files with a preload file

const path = require("path");
const os = require("os");
const fs = require("fs");
const resizeImg = require("resize-img");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");

process.env.NODE_ENV = "production";

// check if application is being run in development mode
const isDev = process.env.NODE_ENV !== "production";

// checks if current platform is mac
const isMac = process.platform === "darwin";

let mainWindow;

// creates main window function, with title and dimensions
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
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

  // remove mainWindow from mem on close
  mainWindow.on("closed", () => (mainWindow = null));

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

// respond to ipcRenderer resize
ipcMain.on("image:resize", (e, options) => {
  // verify main recieved options via image:resize channel
  options.dest = path.join(os.homedir(), "imageresizer");
  resizeImage(options);
  console.log(options);
});

async function resizeImage({ imgPath, width, height, dest }) {
  try {
    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    // create filename
    const filename = path.basename(imgPath);

    // create dest folder if non existant
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // write file to dest folder
    fs.writeFileSync(path.join(dest, filename), newPath);

    // send success to renderer
    mainWindow.webContents.send("image:done");

    // open dest folder
    shell.openPath(dest);
  } catch (error) {
    console.error(error);
  }
}

// respects mac's standard where apps don't close until you cmd+q
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
