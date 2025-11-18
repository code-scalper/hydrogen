export {};

declare global {
	interface Window {
		electronAPI: {
			runExe: (payload?: {
				sfc?: string | null;
				values?: Record<string, string>;
				skipExe?: boolean;
			}) => Promise<{
				status: string;
				frames: Array<{
					time: number;
					values: Record<string, string>;
				}>;
				outputDate: string;
				outputDir: string;
			}>;
			stopExe: () => Promise<{ stopped: boolean }>;
			readRecentLogs: () => Promise<
				Array<{
					date: string;
					entries: Array<{
						ts?: string;
						level?: string;
						code?: string;
						desc?: string;
						solution?: { ko?: string; en?: string };
					}>;
				}>
			>;
			readOutputData: (payload?: {
				date?: string;
			}) => Promise<{
				date: string | null;
				frames: Array<{
					time: number;
					values: Record<string, string>;
				}>;
			}>;
			readProgressLog: (payload?: {
				date?: string;
			}) => Promise<{
				date: string;
				exists: boolean;
				raw: string;
				updatedAt: number | null;
			}>;
			readEconomicEvaluation: (payload?: {
				date?: string;
			}) => Promise<{
				date: string | null;
				report: Record<string, number | string | null>;
				cashflow: Array<Record<string, number | string | null>>;
				coefficients: Array<Record<string, number | string | null>>;
			}>;
			downloadReportFiles: (payload?: {
				date?: string;
			}) => Promise<
				| { success: true; files: string[]; date: string; opened: boolean }
				| {
						 success: false;
						 reason: "NO_OUTPUT_DIR" | "MISSING_FILES" | "COPY_FAILED";
						 missing?: string[];
						 file?: string;
				   }
			>;
		};
		electronStore: {
			get: (key: string) => Promise<unknown>;
			set: (key: string, value: unknown) => Promise<void>;
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
