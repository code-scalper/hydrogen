import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
import Store from "electron-store";
import { execFile } from "child_process";

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
  console.log(app.isPackaged, "is packaged");
  console.log(process.resourcesPath, "@@@");
  console.log(__dirname, "@@@@");
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

// 계산모듈실행
ipcMain.handle("run-exe", async (_event, payload?: RunExePayload) => {
  const isDev = !app.isPackaged;

  // ✅ 플랫폼 분기: .exe는 Windows 전용
  if (process.platform !== "win32") {
    const msg =
      "이 기능은 Windows에서만 실행됩니다. (현재 OS: " + process.platform + ")";
    console.warn("[run-exe] " + msg);
    dialog.showErrorBox("Unsupported platform", msg);
    throw new Error(msg);
  }

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

  // ✅ 2-1) 수정된 Excel을 workingDir로 복사 (EXE가 CWD에서 찾음)
  try {
    const srcXlsx = path.join(thirdPartyDir, "Input_Total.xlsx");
    const dstXlsx = path.join(workingDir, "Input_Total.xlsx");

    if (!fs.existsSync(srcXlsx)) {
      throw new Error(`Input_Total.xlsx 원본이 없습니다: ${srcXlsx}`);
    }

    // 동일 파일/잠금 이슈 최소화를 위해 덮어쓰기
    fs.copyFileSync(srcXlsx, dstXlsx);
    console.log("📄 엑셀 복사 완료:", dstXlsx);
  } catch (err) {
    console.error("❌ 엑셀 복사 실패:", err);
    throw err;
  }

  // ✅ 3) EXE 실행
  return new Promise<string>((resolve, reject) => {
    console.log("🟡 실행 시작:", exePath);
    console.log("📁 작업 디렉토리:", workingDir);

    // 필요하면 timeout, maxBuffer 등 옵션을 더 줄 수 있음
    execFile(exePath, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ 실행 실패:", error);
        if (stderr) console.error("stderr:", stderr);
        reject(error);
        return;
      }

      console.log("✅ 실행 완료");
      if (stdout) console.log("stdout:", stdout);

      // ✅ 4) 실행 후 새 Output_*.csv 감지 → 기본 이름에만 -n 채번
      const postFiles = fs
        .readdirSync(workingDir)
        .filter((f) => /^Output_\d+\.csv$/i.test(f));

      for (const file of postFiles) {
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        if (/-\d+$/.test(baseName)) continue; // 이미 채번된 건 스킵

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
        console.log(`📄 새 파일 리네이밍: ${file} → ${newFileName}`);
      }

      resolve("실행 완료");
    });
  });
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
