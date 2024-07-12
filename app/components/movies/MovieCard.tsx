import clsx from 'clsx';
import { useMemo, type FC } from 'react';
import { type MovieDB } from '~/api';
import { getMoviePosterUrl } from '~/utils/misc';
import { type Genre, type HandleMovieSelect } from './types';

interface MovieCardProps extends MovieDB {
	genres: Genre[];
	onMovieSelect: HandleMovieSelect;
}

const ScoreCard: FC<Pick<MovieCardProps, 'vote_average'>> = ({
	vote_average,
}) => {
	const isGreen = vote_average > 7.5;
	const isRed = vote_average < 4.5;
	const isOrange = !isRed && !isGreen;

	return (
		<div
			className={clsx('absolute left-2 top-2 rounded-xl p-2 font-bold', {
				'bg-green-400': isGreen,
				'bg-yellow-400': isOrange,
				'bg-red-500': isRed,
			})}
		>
			{vote_average.toPrecision(2)}
		</div>
	);
};

export const MovieCard: FC<MovieCardProps> = ({
	onMovieSelect,
	genres,
	...movie
}) => {
	const {
		title,
		vote_average,
		genre_ids,
		release_date,
		id,
		poster_path,
		overview,
	} = movie;
	const movieGenres = useMemo(
		() => genres.filter(({ id }) => genre_ids.includes(id)),
		[genres, genre_ids],
	);

	const stringifyGenres = movieGenres.map(({ name }) => name).join(', ');

	const releaseYear = new Date(release_date).getFullYear();

	return (
		<div
			className="flex max-h-56 cursor-pointer justify-between space-x-5 border bg-card p-6 shadow-lg hover:border-gray-300 hover:bg-accent sm:rounded-3xl"
			onClick={() => onMovieSelect({ findId: id, genres: movieGenres })}
		>
			<div className="relative min-h-[231px] min-w-[154px] max-w-[154px]">
				<ScoreCard vote_average={vote_average} />
				<img
					className="h-full w-full rounded-3xl object-cover shadow-lg"
					src={getMoviePosterUrl(poster_path)}
					alt={title}
				/>
			</div>
			<div className="flex w-full flex-col space-y-2">
				<div>
					<h3 className="ext-lg line-clamp-1 justify-center font-bold">
						{title}
					</h3>
					<span>({releaseYear})</span>
				</div>
				<div>
					<div className="text-sm text-gray-400">
						Genre: <span className="text-gray-800">{stringifyGenres}</span>
					</div>
				</div>
				<p className="line-clamp-3 text-gray-500">{overview}</p>
			</div>
		</div>
	);
};
