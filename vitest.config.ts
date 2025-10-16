import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "happy-dom",
		coverage: {
			provider: "istanbul",
			reporter: ["text", "json", "html"],
			enabled: true,
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(dirname, "./src"),
		},
	},
	server: {
		port: 51204,
		host: "0.0.0.0",
	},
});
