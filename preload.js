const { contextBridge } = require("electron");
const os = require("os");
const path = require("path");

// passes in function homedir to renderer
contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});

// passes in function join to renderer
contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});
