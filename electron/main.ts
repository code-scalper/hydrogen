import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
import Store from "electron-store";
import { spawn } from "child_process";

import {
  ensureInputTotalWorkbook,
  updateInputTotalWorkbook,
  readWorksheetRows,
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
  skipExe?: boolean;
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

type SimulationFrame = {
  time: number;
  values: Record<string, string>;
};

type RunExeResult = {
  status: string;
  frames: SimulationFrame[];
  outputDate: string;
  outputDir: string;
};

function runExternalExecutable(executable: string, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, {
      cwd,
      windowsHide: true,
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.stdout?.on("data", (chunk) => {
      console.log(`[exe stdout] ${chunk}`);
    });

    child.stderr?.on("data", (chunk) => {
      console.error(`[exe stderr] ${chunk}`);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Executable exited with code ${code}`));
    });
  });
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function sanitizeFrameValues(
  row: string[],
  headers: string[],
  timeIndex: number
): SimulationFrame | null {
  if (timeIndex < 0 || timeIndex >= headers.length) {
    return null;
  }

  const rawTime = row[timeIndex] ?? "";
  const time = Number.parseFloat(rawTime);
  if (!Number.isFinite(time)) {
    return null;
  }

  const values: Record<string, string> = {};
  headers.forEach((header, index) => {
    if (index === timeIndex) return;
    if (!header) return;
    const cellValue = row[index];
    if (cellValue === undefined || cellValue === null) {
      values[header] = "";
      return;
    }
    values[header] = `${cellValue}`;
  });

  return { time, values };
}

function readFramesFromCsv(filePath: string): SimulationFrame[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  const timeIndex = headers.findIndex(
    (header) => header.toLowerCase() === "time"
  );
  if (timeIndex === -1) {
    console.warn("Output CSV missing Time column");
    return [];
  }

  const frames: SimulationFrame[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const row = parseCsvLine(lines[i]);
    const frame = sanitizeFrameValues(row, headers, timeIndex);
    if (frame) {
      frames.push(frame);
    }
  }

  return frames;
}

function readFramesFromWorkbook(filePath: string): SimulationFrame[] {
  try {
    const rows = readWorksheetRows(filePath);
    if (rows.length === 0) {
      return [];
    }

    const headers = rows[0].map((cell) => cell.trim());
    const timeIndex = headers.findIndex(
      (header) => header.toLowerCase() === "time"
    );

    if (timeIndex === -1) {
      console.warn("Workbook missing Time column");
      return [];
    }

    const frames: SimulationFrame[] = [];
    for (let i = 1; i < rows.length; i += 1) {
      const row = rows[i];
      const frame = sanitizeFrameValues(row, headers, timeIndex);
      if (frame) {
        frames.push(frame);
      }
    }

    return frames;
  } catch (error) {
    console.error("Failed to read simulation workbook", filePath, error);
    return [];
  }
}

function readSimulationFrames(workingDir: string): SimulationFrame[] {
  const xlsxPath = path.join(workingDir, "Output_Total.xlsx");
  if (fs.existsSync(xlsxPath)) {
    const frames = readFramesFromWorkbook(xlsxPath);
    if (frames.length > 0) {
      return frames;
    }
  }

  const csvPath = path.join(workingDir, "Output_Total.csv");
  if (fs.existsSync(csvPath)) {
    return readFramesFromCsv(csvPath);
  }

  return [];
}

// 계산모듈실행
ipcMain.handle("run-exe", async (_event, payload?: RunExePayload) => {
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
  const shouldSkipExe = payload?.skipExe ?? false;
  const outputDate = today;

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

  let status: string;

  if (shouldSkipExe) {
    status = "EXE skipped by user toggle";
    console.info("[run-exe] Execution skipped by user toggle");
  } else if (process.platform === "win32") {
    try {
      await runExternalExecutable(exePath, workingDir);
      status = "EXE completed successfully";
    } catch (error) {
      console.error("❌ EXE 실행 실패:", error);
      throw error;
    }
  } else {
    status = `EXE execution skipped: unsupported platform (${process.platform})`;
    console.warn(
      `run-exe called on unsupported platform (${process.platform}); executable skipped.`
    );
  }

  const frames = readSimulationFrames(workingDir);
  const result: RunExeResult = {
    status,
    frames: frames.sort((a, b) => a.time - b.time),
    outputDate,
    outputDir: workingDir,
  };

  return result;
});

ipcMain.handle(
  "read-output-data",
  async (_event, payload?: { date?: string }) => {
    const baseOutputDir = getBaseOutputDir();

    const normalizeDate = (input?: string) => {
      if (!input) return null;
      const digits = input.replace(/[^0-9]/g, "");
      return digits.length === 8 ? digits : null;
    };

    const tryResolveDirectory = (date?: string) => {
      if (!date) return null;
      const candidate = path.join(baseOutputDir, date);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        return { dir: candidate, date };
      }
      return null;
    };

    const normalized = normalizeDate(payload?.date);
    let target = tryResolveDirectory(normalized ?? undefined);

    if (!target) {
      try {
        const candidates = fs
          .readdirSync(baseOutputDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory() && /^\d{8}$/.test(entry.name))
          .map((entry) => entry.name)
          .sort();

        const latest = candidates.at(-1) ?? null;
        if (latest) {
          target = { dir: path.join(baseOutputDir, latest), date: latest };
        }
      } catch (error) {
        console.error("Failed to scan output directory", baseOutputDir, error);
      }
    }

    if (!target) {
      return { frames: [] as SimulationFrame[], date: null };
    }

    try {
      const frames = readSimulationFrames(target.dir).sort(
        (a, b) => a.time - b.time,
      );
      return { frames, date: target.date };
    } catch (error) {
      console.error("Failed to read output data", target, error);
      return { frames: [] as SimulationFrame[], date: target.date };
    }
  },
);

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
              console.warn("Failed to parse log line", {
                logPath,
                line,
                error,
              });
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
