import { useCallback } from "react";

const normalizeDate = (date?: string | null) => {
	if (!date) return null;
	const digits = date.replace(/[^0-9]/g, "");
	return digits.length === 8 ? digits : null;
};

const showMissingMessage = () => {
	if (typeof window === "undefined") return;
	window.alert("계산을 먼저 실행하세요");
};

export const useOutputTotalDownloader = (date: string | null) => {
	return useCallback(async () => {
		if (typeof window === "undefined") {
			return;
		}
		const targetDate = normalizeDate(date);
		if (!targetDate) {
			showMissingMessage();
			return;
		}

		const download = window.electronAPI?.downloadOutputTotal;
		if (typeof download !== "function") {
			window.alert("파일 다운로드를 지원하지 않는 환경입니다.");
			return;
		}

		try {
			const response = await download({ date: targetDate });
			if (!response?.success) {
				if (
					response?.reason === "MISSING_FILE" ||
					response?.reason === "NO_OUTPUT_DIR"
				) {
					showMissingMessage();
					return;
				}
				window.alert("파일을 다운로드하지 못했습니다.");
				return;
			}

			if (response.opened) {
				window.alert(
					"Output_Total.csv 파일을 다운로드했습니다. (다운로드 폴더가 열렸습니다.)",
				);
				return;
			}

			window.alert(
				"Output_Total.csv 파일을 다운로드했습니다. (다운로드 폴더 확인)",
			);
		} catch (error) {
			console.error("download-output-total", error);
			window.alert("파일을 다운로드하지 못했습니다.");
		}
	}, [date]);
};

export default useOutputTotalDownloader;
