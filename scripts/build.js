#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// node_modules/.bin 경로 helper (윈도우 .cmd 처리)
const binPath = (name) =>
  path.join(
    __dirname,
    "..",
    "node_modules",
    ".bin",
    process.platform === "win32" ? `${name}.cmd` : name
  );

const run = (cmd, args = [], options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 0));
  });

const runStrict = async (cmd, args = [], options = {}) => {
  const code = await run(cmd, args, options);
  if (code !== 0) {
    throw new Error(
      `${path.basename(cmd)} ${args.join(" ")} exited with code ${code}`
    );
  }
};

const main = async () => {
  try {
    // 1) 타입체크/트랜스파일
    const tsc = binPath("tsc");
    if (fs.existsSync(tsc)) {
      await runStrict(tsc, []);
    }

    // 2) 렌더러/정적 번들
    const vite = binPath("vite");
    await runStrict(vite, ["build"]);
  } catch (err) {
    console.error("❌ Build pipeline failed:", err?.message ?? err);
    process.exit(1);
  }

  // 3) electron-builder 패키징(옵션)
  const shouldSkip =
    process.env.SKIP_ELECTRON_BUILDER === "true" || process.env.CI === "true";

  if (shouldSkip) {
    console.warn(
      "⚠️  Electron packaging skipped (SKIP_ELECTRON_BUILDER/CI is true)."
    );
    process.exit(0);
  }

  // electron-builder 실행 (package.json의 "build" 설정 사용)
  const eb = binPath("electron-builder");
  const args = fs.existsSync(
    path.join(__dirname, "..", "electron-builder.json5")
  )
    ? ["--config", "electron-builder.json5"]
    : ["-c"]; // package.json 내 build 섹션 사용

  const code = await run(eb, args);
  if (code !== 0) {
    console.error("❌ electron-builder failed with code", code);
    process.exit(code);
  }
};

await main();
