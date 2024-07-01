import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { json, redirect, useLoaderData } from '@remix-run/react';
import { discoverMovie$ } from '~/api/moviedb';
import { SearchBar } from '~/components/SearchBar';
import { StatusState } from '~/types';

export const meta: MetaFunction = () => {
	return [
		{ title: '[TBD] Add page' },
		{ name: 'description', content: '[TBD] Add page description!' },
	];
};

// const UserSearchResultSchema = z.object({
// 	id: z.string(),
// 	username: z.string(),
// 	name: z.string().nullable(),
// 	imageId: z.string().nullable(),
// });

// const MoviesSearchResultsSchema = z.array(UserSearchResultSchema);

export async function loader({ request }: LoaderFunctionArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search');

	if (searchTerm === null || searchTerm === undefined) {
		return json({ status: StatusState.IDLE, movies: [], error: null });
	}

	const trimmedSearchTerm = searchTerm.trim();
	if (trimmedSearchTerm === '') {
		return redirect('/movies/new');
	}


	const result = await discoverMovie$(trimmedSearchTerm);

	if (result.success) {
		return json({
			status: StatusState.SUCCESS,
			movies: result.data,
			error: null,
		});
	} else {
		return json({
			status: StatusState.ERROR,
			movies: [],
			error: { message: result.error.message },
		});
	}
}

export default function New() {
	// const actionData = useActionData<typeof action>();
	const data = useLoaderData<typeof loader>();
	console.log("🚀 ~ New ~ data:", data)

	return (
		<div className="p-4 font-sans">
			<h1 className="text-3xl">[TBD] Add New Movie </h1>

			<div className="mx-auto w-full max-w-md px-8">
				<SearchBar
					autoFocus
					autoSubmit
					status={data.status}
					formAction="/movies/new"
				/>
			</div>
		</div>
	);
}
