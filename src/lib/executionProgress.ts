import {
	EXECUTION_PROGRESS_CODE_SET,
	type ExecutionProgressCode,
} from "@/constants/executionProgress";

export interface ExecutionLogEntry {
	timestamp?: string;
	code?: string;
	description?: string;
	solutionKo?: string;
	solutionEn?: string;
}

const ENTRY_PATTERN =
	/\[(?<timestamp>[^\]]+)\]\n\[\s*StatusCode\s*\]\s*(?<code>[^\n]+)\n\[\s*Description\s*\]\s*(?<description>[^\n]+)\n\[\s*Solution\.KO\s*\]\s*(?<solutionKo>[^\n]+)\n\[\s*Solution\.EN\s*\]\s*(?<solutionEn>[^\n]+)/g;

const sanitize = (value?: string | null) =>
	value?.replace(/\r/g, "").trim() ?? undefined;

export const parseExecutionLog = (raw: string): ExecutionLogEntry[] => {
	const entries: ExecutionLogEntry[] = [];
	if (!raw) {
		return entries;
	}

	const normalized = raw.replace(/\r\n/g, "\n");
	for (const match of normalized.matchAll(ENTRY_PATTERN)) {
		const groups = match.groups ?? {};
		entries.push({
			timestamp: sanitize(groups.timestamp),
			code: sanitize(groups.code),
			description: sanitize(groups.description),
			solutionKo: sanitize(groups.solutionKo),
			solutionEn: sanitize(groups.solutionEn),
		});
	}

	return entries;
};

export const extractRecognizedCodes = (
	entries: ExecutionLogEntry[],
): ExecutionProgressCode[] => {
	return entries
		.map((entry) => entry.code)
		.filter(
			(code): code is ExecutionProgressCode =>
				!!code &&
				EXECUTION_PROGRESS_CODE_SET.has(code as ExecutionProgressCode),
		);
};

export const getLatestRecognizedCode = (
	entries: ExecutionLogEntry[],
): ExecutionProgressCode | null => {
	const recognized = extractRecognizedCodes(entries);
	const last = recognized.at(-1);
	return last ?? null;
};
