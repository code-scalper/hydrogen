export {};

declare global {
	interface Window {
		electronAPI: {
			runExe: (payload?: {
				sfc?: string | null;
				values?: Record<string, string>;
			}) => Promise<{
				status: string;
				frames: Array<{
					time: number;
					values: Record<string, string>;
				}>;
			}>;
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
