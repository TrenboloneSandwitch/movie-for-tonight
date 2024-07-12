import { type SerializeFrom } from '@remix-run/node';
import { type FC } from 'react';
import { useDelayedIsPending } from '~/hooks/useDelayedIsPending';
import { type loader } from '~/routes/movies+/new';
import { HTMLStatus } from '~/types';
import { SearchBar } from '../SearchBar';
import { MovieList } from './MovieList';
import { type HandleMovieSelect } from './types';

interface SearchViewProps {
	data: SerializeFrom<typeof loader>;
	onMovieSelect: HandleMovieSelect;
}

export const SearchView: FC<SearchViewProps> = ({ data, onMovieSelect }) => {
	const isPending = useDelayedIsPending({
		formMethod: HTMLStatus.GET,
		formAction: '/movies/new',
	});

	return (
		<>
			<h1 className="mb-4 text-2xl">[TBD] Find movie you want to add </h1>

			<div className="w-full">
				<SearchBar
					autoFocus
					autoSubmit
					status={data.status}
					formAction="/movies/new"
				/>
			</div>
			<main className="my-4">
				<MovieList
					isPending={isPending}
					data={data}
					onMovieSelect={onMovieSelect}
				/>
			</main>
		</>
	);
};
