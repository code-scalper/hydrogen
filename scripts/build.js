#!/usr/bin/env node

import { spawn } from "node:child_process";

const runCommand = (command, args, options = {}) =>
	new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			shell: false,
			stdio: "pipe",
			...options,
		});

		let stdout = "";
		let stderr = "";

		child.stdout?.on("data", (chunk) => {
			stdout += chunk.toString();
			process.stdout.write(chunk);
		});

		child.stderr?.on("data", (chunk) => {
			stderr += chunk.toString();
			process.stderr.write(chunk);
		});

		child.on("error", (error) => {
			reject(error);
		});

		child.on("exit", (code) => {
			resolve({ code: code ?? 0, stdout, stderr });
		});
	});

const runStrict = async (command, args, options = {}) => {
	const result = await runCommand(command, args, options);
	if (result.code !== 0) {
		throw new Error(`${command} ${args.join(" ")} exited with code ${result.code}`);
	}
};

const main = async () => {
	try {
		await runStrict("npx", ["tsc"]);
		await runStrict("npx", ["vite", "build"]);
	} catch (error) {
		console.error("❌ Build pipeline failed:", error instanceof Error ? error.message : error);
		process.exit(1);
	}

	const shouldSkipElectronBuilder =
		process.env.SKIP_ELECTRON_BUILDER === "true" ||
		process.env.CI === "true";

	if (shouldSkipElectronBuilder) {
		console.warn("⚠️  Electron packaging skipped (SKIP_ELECTRON_BUILDER/CI is true).");
		process.exit(0);
	}

	const result = await runCommand("npx", ["electron-builder", "--config", "electron-builder.json5"]);
	if (result.code === 0) {
		return;
	}

	const combined = `${result.stdout}\n${result.stderr}`;
	const builderErrorKnown =
		process.platform === "darwin" &&
		combined.includes("ERR_ELECTRON_BUILDER_CANNOT_EXECUTE");

	if (builderErrorKnown) {
		console.warn(
			"⚠️  electron-builder could not create a DMG (likely due to a restricted 'hdiutil'). Renderer and main bundles were created successfully. Set SKIP_ELECTRON_BUILDER=true to suppress this warning.",
		);
		process.exit(0);
	}

	console.error("❌ electron-builder failed with code", result.code);
	process.exit(result.code ?? 1);
};

await main();
