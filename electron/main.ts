import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs"; // ✅ 파일 저장용 모듈
import Store from "electron-store";

const store = new Store();
ipcMain.handle("electron-store-get", (event, key) => {
  return store.get(key);
});

ipcMain.handle("electron-store-set", (event, key, value) => {
  store.set(key, value);
});

ipcMain.handle("electron-store-delete", (event, key) => {
  store.delete(key);
});

// 📦 저장 백업 로직 추가
ipcMain.on("save-project-backup", (_event, data, fileName) => {
  const backupPath = path.join(app.getPath("userData"), `${fileName}.json`);
  try {
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ 프로젝트 백업 저장 완료:", backupPath);
  } catch (err) {
    console.error("❌ 프로젝트 백업 저장 실패:", err);
  }
});

createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
