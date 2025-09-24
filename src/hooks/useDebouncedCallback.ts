import { useEffect, useRef } from "react";

export const useDebouncedCallback = <Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
) => {
	const timer = useRef<NodeJS.Timeout | null>(null);

	const debounced = (...args: Args) => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};

	// 컴포넌트 언마운트 시 타이머 클리어
	useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	return debounced;
};
