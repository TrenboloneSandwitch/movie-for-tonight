import debounce from 'debounce';
import { useRef, useEffect, useMemo } from 'react';

export function useDebounce<
	Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
	const callbackRef = useRef(callback);
	useEffect(() => {
		callbackRef.current = callback;
	});

	return useMemo(
		() =>
			debounce(
				(...args: Parameters<Callback>) => callbackRef.current(...args),
				delay,
			),
		[delay],
	);
}
