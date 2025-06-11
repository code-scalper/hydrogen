import { clsx, type ClassValue } from "clsx";
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
