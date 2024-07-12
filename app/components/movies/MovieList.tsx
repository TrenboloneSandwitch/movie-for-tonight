import { type SerializeFrom } from '@remix-run/node';
import clsx from 'clsx';
import { type FC } from 'react';
import { type loader } from '~/routes/movies+/new';
import { StatusState } from '~/types';
import { ErrorList } from '../ErrorList';
import { MovieCard } from './MovieCard';
import { type HandleMovieSelect } from './types';

interface MovieListProps {
	data: SerializeFrom<typeof loader>;
	isPending: boolean;
	onMovieSelect: HandleMovieSelect;
}

export const MovieList: FC<MovieListProps> = ({
	data,
	isPending,
	onMovieSelect,
}) => {
	const { status, movies } = data;

	if (status === StatusState.ERROR) {
		return <ErrorList errors={['There was an error parsing the results']} />;
	}

	if (status === StatusState.SUCCESS) {
		return !!movies && !!movies.length ? (
			<ul
				className={clsx(
					'grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-11 rounded-3xl p-4 pb-12',
					{
						'opacity-50': isPending,
					},
				)}
			>
				{movies.map(movie => (
					<li key={movie.id}>
						<MovieCard
							{...movie}
							onMovieSelect={onMovieSelect}
							genres={data.genres}
						/>
					</li>
				))}
			</ul>
		) : (
			<p>No users found</p>
		);
	}

	return null;
};
