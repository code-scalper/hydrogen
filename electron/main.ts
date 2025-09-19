import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs"; // ✅ 파일 저장용 모듈
import Store from "electron-store";
import { execFile } from "child_process";

// 계산모듈실행
ipcMain.handle("run-exe", async () => {
  const isDev = !app.isPackaged;
  const exePath = isDev
    ? path.join(__dirname, "..", "third-party", "MHySIM_HRS_Run.exe")
    : path.join(process.resourcesPath, "third-party", "MHySIM_HRS_Run.exe");

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const baseOutputDir = isDev
    ? path.join(__dirname, "..", "output")
    : path.join(process.resourcesPath, "output");
  const datedOutputDir = path.join(baseOutputDir, today);

  if (!fs.existsSync(datedOutputDir)) {
    fs.mkdirSync(datedOutputDir, { recursive: true });
  }

  const workingDir = datedOutputDir;

  // ✅ 1. 실행 전 백업
  const filesBefore = fs
    .readdirSync(workingDir)
    .filter((f) => /^Output_\d+\.csv$/i.test(f));

  for (const file of filesBefore) {
    const ext = path.extname(file); // .csv
    const baseName = path.basename(file, ext); // Output_1022
    let newIndex = 1;
    let newFileName = `${baseName}-${newIndex}${ext}`;

    while (fs.existsSync(path.join(workingDir, newFileName))) {
      newIndex++;
      newFileName = `${baseName}-${newIndex}${ext}`;
    }

    const from = path.join(workingDir, file);
    const to = path.join(workingDir, newFileName);
    fs.renameSync(from, to);
    console.log(`📁 백업됨: ${file} → ${newFileName}`);
  }

  // ✅ 2. EXE 실행
  return new Promise((resolve, reject) => {
    console.log("🟡 실행 시작:", exePath);
    console.log("📁 작업 디렉토리:", workingDir);

    execFile(exePath, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ 실행 실패:", error);
        reject("실패");
        return;
      }

      console.log("✅ 실행 완료");
      console.log("stdout:", stdout);

      // ✅ 3. 실행 후 새로 생긴 Output_*.csv 감지
      const postFiles = fs
        .readdirSync(workingDir)
        .filter((f) => /^Output_\d+\.csv$/i.test(f));

      for (const file of postFiles) {
        const ext = path.extname(file); // .csv
        const baseName = path.basename(file, ext);

        // 이미 -n 붙어있는 건 건너뜀
        if (/-\d+$/.test(baseName)) continue;

        // 즉, Output_1022.csv 같은 기본 이름이면 → 채번 이동
        let newIndex = 1;
        let newFileName = `${baseName}-${newIndex}${ext}`;
        while (fs.existsSync(path.join(workingDir, newFileName))) {
          newIndex++;
          newFileName = `${baseName}-${newIndex}${ext}`;
        }

        const from = path.join(workingDir, file);
        const to = path.join(workingDir, newFileName);
        fs.renameSync(from, to);
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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
