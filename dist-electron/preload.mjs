"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  runExe: (payload) => electron.ipcRenderer.invoke("run-exe", payload),
  readRecentLogs: () => electron.ipcRenderer.invoke("read-recent-logs"),
  readOutputData: (payload) => electron.ipcRenderer.invoke("read-output-data", payload),
  readProgressLog: (payload) => electron.ipcRenderer.invoke("read-progress-log", payload)
});
electron.contextBridge.exposeInMainWorld("electronStore", {
  get: (key) => electron.ipcRenderer.invoke("electron-store-get", key),
  set: (key, value) => electron.ipcRenderer.invoke("electron-store-set", key, value),
  delete: (key) => electron.ipcRenderer.invoke("electron-store-delete", key)
});
