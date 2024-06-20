import fetch from 'node-fetch';
import { HTMLStatus } from '../types';

const discover = 'https://api.themoviedb.org/3/discover/movie';

const options = {
	method: HTMLStatus.GET,
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${process.env.MOVIEDB_API_KEY}`,
	},
};

export const discoverMovie$ = () =>
	fetch(discover, options)
		.then(res => res.json())
		.then(json => ({
			success: true,
			data: json,
		}))
		.catch(err => ({ success: false, error: err }));
