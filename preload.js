const { contextBridge, ipcRenderer } = require("electron");
const os = require("os");
const path = require("path");
const Toastify = require("toastify-js");

// passes in function homedir to renderer
contextBridge.exposeInMainWorld("os", {
  homedir: () => os.homedir(),
});

// passes in function join to renderer
contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld("Toastify", {
  // in this context options is expected to be an object with properties while the above ...args are expected to be a potentially unlimited amount of arguments
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
