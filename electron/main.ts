import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
import Store from "electron-store";

import {
  ensureInputTotalWorkbook,
  updateInputTotalWorkbook,
} from "./utils/xlsx";

//
// ✅ __dirname 등 경로 상수는 가장 먼저 계산 (하단에 있던 것을 상단으로 이동)
//
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

//
// ✅ 공통 경로 헬퍼
//
function getThirdPartyDir() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "third-party")
    : path.join(__dirname, "..", "third-party");
}
function getBaseOutputDir() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "output")
    : path.join(__dirname, "..", "output");
}
function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

interface RunExePayload {
  sfc?: string | null;
  values?: Record<string, string>;
}

type LogLine = {
  ts?: string;
  level?: string;
  code?: string;
  desc?: string;
  solution?: { ko?: string; en?: string };
};

type RecentLogPayload = {
  date: string;
  entries: LogLine[];
};

// 계산모듈실행
ipcMain.handle("run-exe", async (_event, payload?: RunExePayload) => {
  const isDev = !app.isPackaged;

  // ✅ 플랫폼 분기: .exe는 Windows 전용
  // if (process.platform !== "win32") {
  //   const msg =
  //     "이 기능은 Windows에서만 실행됩니다. (현재 OS: " + process.platform + ")";
  //   console.warn("[run-exe] " + msg);
  //   dialog.showErrorBox("Unsupported platform", msg);
  //   throw new Error(msg);
  // }

  const thirdPartyDir = getThirdPartyDir();
  const exePath = path.join(thirdPartyDir, "MHySIM_HRS_Run.exe");

  if (!fs.existsSync(exePath)) {
    const msg =
      "실행 파일을 찾을 수 없습니다:\n" +
      exePath +
      "\n\n패키징 시 extraResources에 third-party를 포함했는지 확인하세요.";
    console.error("[run-exe] " + msg);
    dialog.showErrorBox("Executable missing", msg);
    throw new Error(msg);
  }

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const baseOutputDir = getBaseOutputDir();
  ensureDir(baseOutputDir);
  const datedOutputDir = path.join(baseOutputDir, today);
  ensureDir(datedOutputDir);

  const workingDir = datedOutputDir;

  // ✅ 1) 실행 전 백업 (Output_*.csv → -n 채번)
  const filesBefore = fs
    .readdirSync(workingDir)
    .filter((f) => /^Output_\d+\.csv$/i.test(f));

  for (const file of filesBefore) {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    let newIndex = 1;
    let newFileName = `${baseName}-${newIndex}${ext}`;
    while (fs.existsSync(path.join(workingDir, newFileName))) {
      newIndex++;
      newFileName = `${baseName}-${newIndex}${ext}`;
    }
    fs.renameSync(
      path.join(workingDir, file),
      path.join(workingDir, newFileName)
    );
    console.log(`📁 백업됨: ${file} → ${newFileName}`);
  }

  // ✅ 2) Excel 업데이트 (있을 때만)
  try {
    const values = payload?.values ?? {};
    const sfc = payload?.sfc ?? null;
    if (Object.keys(values).length > 0 || sfc) {
      const workbookBaseDir = thirdPartyDir;
      const workbookPath = ensureInputTotalWorkbook(workbookBaseDir);
      updateInputTotalWorkbook(workbookPath, values, sfc);
    }
  } catch (error) {
    console.error("❌ Excel 업데이트 실패:", error);
    throw error;
  }

  // ✅ 3) EXE 실행은 디버그를 위해 건너뜀
  console.log("🟡 EXE 실행 생략: Input_Total.xlsx 업데이트만 수행되었습니다.");
  return "EXE skipped after workbook update";
});

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

ipcMain.handle("read-recent-logs", async () => {
  const baseOutputDir = getBaseOutputDir();
  const results: RecentLogPayload[] = [];
  const today = new Date();

  for (let i = 0; i < 5; i += 1) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - i);
    const displayDate = getDateKey(targetDate);
    const folderName = displayDate.replace(/-/g, "");
    const logPath = path.join(baseOutputDir, folderName, "MHySIM.jsonl");

    let entries: LogLine[] = [];

    if (fs.existsSync(logPath)) {
      try {
        const contents = fs.readFileSync(logPath, "utf-8");
        entries = contents
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            try {
              return JSON.parse(line) as LogLine;
            } catch (error) {
              console.warn("Failed to parse log line", { logPath, line, error });
              return null;
            }
          })
          .filter((item): item is LogLine => item !== null);
      } catch (error) {
        console.error("Failed to read log file", logPath, error);
      }
    }

    results.push({ date: displayDate, entries });
  }

  return results;
});

const store = new Store();
ipcMain.handle("electron-store-get", (_, key) => {
  return store.get(key);
});
ipcMain.handle("electron-store-set", (_, key, value) => {
  store.set(key, value);
});
ipcMain.handle("electron-store-delete", (_, key) => {
  store.delete(key);
});

// 📦 저장 백업 로직
ipcMain.on("save-project-backup", (_event, data, fileName) => {
  const backupPath = path.join(app.getPath("userData"), `${fileName}.json`);
  try {
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ 프로젝트 백업 저장 완료:", backupPath);
  } catch (err) {
    console.error("❌ 프로젝트 백업 저장 실패:", err);
  }
});

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC!, "electron-vite.svg"),
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
    console.log("RENDERER_DIST:", RENDERER_DIST);
    console.log("index.html path:", path.join(RENDERER_DIST, "index.html"));
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
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(createWindow);
