import { type SerializeFrom } from '@remix-run/node';
import { type loader as newMovieLoader } from '~/routes/movies+/new';
import { type loader as mainLoader } from './routes/_main+';

export enum HTMLStatus {
	POST = 'POST',
	GET = 'GET',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

export enum StatusState {
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR',
	IDLE = 'IDLE',
}

// LOADERS TYPES
export type MainMoviesLoader = SerializeFrom<typeof mainLoader>;
export type NewMovieLoader = SerializeFrom<typeof newMovieLoader>;
