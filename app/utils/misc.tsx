export const IMAGE_ROUTE = 'https://image.tmdb.org/t/p/w154';

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
	...headers: Array<ResponseInit['headers'] | null | undefined>
) {
	const combined = new Headers();
	for (const header of headers) {
		if (!header) continue;
		for (const [key, value] of new Headers(header).entries()) {
			combined.append(key, value);
		}
	}
	return combined;
}

export const getMoviePosterUrl = (path?: string) => {
	return path ? `${IMAGE_ROUTE}${path}` : '/img/placeholder.png';
};
