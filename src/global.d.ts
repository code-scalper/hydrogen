export {};

declare global {
	interface Window {
		ipcRenderer: {
			on: (
				channel: string,
				listener: (event: any, ...args: any[]) => void,
			) => void;
			off: (channel: string, listener: (...args: any[]) => void) => void;
			send: (channel: string, ...args: any[]) => void;
			invoke: (channel: string, ...args: any[]) => Promise<any>;
		};
		electronStore: {
			get: (key: string) => Promise<any>;
			set: (key: string, value: any) => Promise<void>;
			delete: (key: string) => Promise<void>;
		};
	}
}
