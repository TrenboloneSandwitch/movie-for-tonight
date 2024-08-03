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
			orderBy: { [id ?? 'createdAt']: direction ?? 'desc' },
		});

		return json({ movies });
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

	return <MoviesTable movies={movies} />;
}
