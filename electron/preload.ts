import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
});
contextBridge.exposeInMainWorld("electronAPI", {
  runExe: (
    payload?: {
      sfc?: string | null;
      values?: Record<string, string>;
      skipExe?: boolean;
    },
  ) => ipcRenderer.invoke("run-exe", payload),
  stopExe: () => ipcRenderer.invoke("stop-exe"),
  readRecentLogs: () => ipcRenderer.invoke("read-recent-logs"),
  readOutputData: (payload?: { date?: string }) =>
    ipcRenderer.invoke("read-output-data", payload),
  readProgressLog: (payload?: { date?: string }) =>
    ipcRenderer.invoke("read-progress-log", payload),
  readEconomicEvaluation: (payload?: { date?: string }) =>
    ipcRenderer.invoke("read-economic-evaluation", payload),
  downloadReportFiles: (payload?: { date?: string }) =>
    ipcRenderer.invoke("download-report-files", payload),
  downloadOutputTotal: (payload?: { date?: string }) =>
    ipcRenderer.invoke("download-output-total", payload),
});

contextBridge.exposeInMainWorld("electronStore", {
  get: (key: string) => ipcRenderer.invoke("electron-store-get", key),
  set: (key: string, value: any) =>
    ipcRenderer.invoke("electron-store-set", key, value),
  delete: (key: string) => ipcRenderer.invoke("electron-store-delete", key),
});
