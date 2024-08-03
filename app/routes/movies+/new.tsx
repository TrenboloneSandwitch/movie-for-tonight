import { parseWithZod } from '@conform-to/zod';
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
	redirect,
} from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { discoverMovie$ } from '~/api';
import {
	type HandleMovieSelect,
	type SelectedMovie,
	SearchView,
	FormView,
	MovieSchema,
} from '~/components/movies';
import { prisma } from '~/db.server';
import { StatusState } from '~/types';
import { redirectWithToast } from '~/utils/toast.server';

export const meta: MetaFunction = () => {
	return [
		{ title: '[TBD] Add page' },
		{ name: 'description', content: '[TBD] Add page description!' },
	];
};

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = await parseWithZod(formData, {
		async: true,
		schema: MovieSchema,
	});

	if (submission.status === 'success') {
		try {
			//  const alreadyExist = await prisma.movie.findFirst({
			// 		where: {
			// 		 apiId: submission.value.apiId,

			// 		},
			// 	});
			await prisma.movie.create({
				data: {
					alreadySeen: false,
					apiId: submission.value.apiId,
					title: submission.value.title,
					description: submission.value.description,
					releaseDate: submission.value.releaseDate,
					rating: submission.value.rating,
					genres: {
						connect: submission.value.genres.map(({ id }) => ({ id })),
					},
					profilePic: submission.value.profilePic,
					author: { connect: { id: '1' } },
				},
			});

			return redirectWithToast('/', {
				type: 'success',
				title: 'Movie saved!',
				description: 'Your movie was successfully saved to favorites.',
			});
		} catch (error) {
			return redirectWithToast('/', {
				type: 'error',
				title: 'Error Occured!',
				description: "We couldn't save your movie to favorites.",
			});
		}
	}

	if (!submission.status || submission.status === 'error') {
		return json({ status: 'error', submission: submission.reply() } as const, {
			status: 400,
		});
	}

	return json({ status: 'idle', submission: submission.reply() } as const);
}

export async function loader({ request }: LoaderFunctionArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search');

	if (searchTerm === null || searchTerm === undefined) {
		return json({
			status: StatusState.IDLE,
			movies: null,
			error: null,
			genres: null,
		});
	}

	const trimmedSearchTerm = searchTerm.trim();
	if (trimmedSearchTerm === '') {
		return redirect('/movies/new');
	}

	const result = await discoverMovie$(trimmedSearchTerm);

	if (result.success) {
		const genres = await prisma.genre.findMany();
		return json({
			status: StatusState.SUCCESS,
			movies: result.data,
			genres,
			error: null,
		});
	} else {
		return json({
			status: StatusState.ERROR,
			movies: null,
			genres: null,
			error: { message: result.error.message },
		});
	}
}

export default function New() {
	const data = useLoaderData<typeof loader>();
	const [selectedMovie, setSelectedMovie] = useState<SelectedMovie | null>(
		null,
	);

	const handleMovieSelect: HandleMovieSelect = args => {
		if (!args?.findId) {
			return setSelectedMovie(null);
		}
		const foundMovie = data.movies?.find(({ id }) => id === args?.findId);
		if (foundMovie) {
			setSelectedMovie({ ...foundMovie, genres: args?.genres });
		}
	};

	return (
		<div className="p-4 font-sans">
			{!selectedMovie ? (
				<SearchView data={data} onMovieSelect={handleMovieSelect} />
			) : (
				<FormView
					onMovieSelect={handleMovieSelect}
					movie={selectedMovie}
					genres={data.genres}
				/>
			)}
		</div>
	);
}
