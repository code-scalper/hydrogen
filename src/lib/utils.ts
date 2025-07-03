import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateCustomId(keyword: string): string {
	// 랜덤 문자열 생성 (10자리)
	const randomString = Math.random().toString(36).substring(2, 12);

	// 날짜 형식: YYYYMMDDHHMMSS
	const now = new Date();
	const formattedDate = now
		.toISOString()
		.replace(/[-:T.Z]/g, "")
		.slice(0, 14); // YYYYMMDDHHMMSS

	// 조합
	return `${keyword}_${randomString}_${formattedDate}`;
}

export function saveLocalStore(key: string, data: any): void {
	window.electronStore.set(key, data);
}

let lastBackupAt = 0;
const BACKUP_INTERVAL = 1000 * 10; // 10초 간격

export const throttledBackup = (data: any, fileName = "backup") => {
	const now = Date.now();
	if (now - lastBackupAt >= BACKUP_INTERVAL) {
		lastBackupAt = now;
		// 👉 Electron main process에 백업 IPC 전송
		window.ipcRenderer.send("save-project-backup", data, fileName);
	}
};

// const autoDownloadJSON = (data: any, filename = "project_data_backup") => {
//   const dataStr = JSON.stringify(data, null, 2);
//   const blob = new Blob([dataStr], { type: "application/json" });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `${filename}.json`;
//   a.style.display = "none";

//   document.body.appendChild(a);
//   a.click(); // 💥 사용자에게 물어보지 않고 자동으로 다운로드 시작
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url); // 메모리 해제
// };
