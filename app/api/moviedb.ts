import fetch from 'node-fetch';
import { HTMLStatus } from '../types';
import { SEARCH_ROUTE } from './constants';
import { type MovieDBResponse } from './types';

const options = {
	method: HTMLStatus.GET,
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${process.env.MOVIEDB_API_KEY}`,
	},
};

export const discoverMovie$ = async (searchTerm: string) => {
	const paramsObj = new URLSearchParams({
		query: searchTerm,
		include_adult: 'false',
		language: 'en-US',
		page: '1',
	});
	const url = `${SEARCH_ROUTE}?${paramsObj.toString()}`;

	return fetch(url, options)
		.then(res => res.json())
		.then((json: unknown) => {
			return {
				success: true,
				data: (json as MovieDBResponse).results,
			} as const;
		})
		.catch(err => ({ success: false, error: err }) as const);
};
