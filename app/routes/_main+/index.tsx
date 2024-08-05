import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import { MoviesTable } from '~/components/movies';
import { prisma } from '~/db.server';

export const meta: MetaFunction = () => {
	return [
		{ title: '[TBD] Movies Summary' },
		// { name: 'description', content: '[TBD] Welcome to Remix!' },
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const searchParams = new URL(request.url).searchParams;
	const direction = searchParams.get('sortDirection');
	const id = searchParams.get('sortBy');

	let movies = [];

	try {
		movies = await prisma.movie.findMany({
			include: { author: true, genres: true },
			orderBy: { [id ?? 'createdAt']: direction ?? 'desc' },
		});
	} catch (error) {
		movies = await prisma.movie.findMany({
			orderBy: { createdAt: 'desc' },
		});

		searchParams.delete('sortDirection');
		searchParams.delete('sortBy');
	}

	return json({ movies });
}

export default function Index() {
	const { movies } = useLoaderData<typeof loader>();

	if (movies.length === 0) {
		return (
			<h2 className="p-8 text-center text-xl">
				[TBD] Please add some movies to your favorites at first...
			</h2>
		);
	}

	return <MoviesTable movies={movies} />;
}
