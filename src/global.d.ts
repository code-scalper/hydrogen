export {};

declare global {
  interface Window {
    electronAPI: {
      runExe: (payload?: {
        sfc?: string | null;
        values?: Record<string, string>;
      }) => Promise<string>;
    };
    electronStore: {
      get: (key: string) => Promise<any>;
      set: (key: string, value: any) => Promise<void>;
      delete: (key: string) => Promise<void>;
    };
    ipcRenderer: {
      on: typeof import("electron").ipcRenderer.on;
      off: typeof import("electron").ipcRenderer.off;
      send: typeof import("electron").ipcRenderer.send;
      invoke: typeof import("electron").ipcRenderer.invoke;
    };
  }
}
