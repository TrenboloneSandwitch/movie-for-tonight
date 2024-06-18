import { z } from 'zod';

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect, useLoaderData } from '@remix-run/react';
import { SearchBar } from '~/components/SearchBar';

export const meta: MetaFunction = () => {
	return [
		{ title: '[TBD] New page' },
		{ name: 'description', content: '[TBD] New page!' },
	];
};

const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
	imageId: z.string().nullable(),
});

const MoviesSearchResultsSchema = z.array(UserSearchResultSchema);

export async function loader({ request }: LoaderFunctionArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search');
	if (searchTerm === '') {
		return redirect('/movies/new');
	}

	const prom = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				success: true,
				data: { id: '1', username: 'test', name: 'test', imageId: '1' },
			});
		}, 1000);
	});

	const result = await prom;

	if (!result.success) {
		return json({ status: 'error', error: result?.error?.message } as const, {
			status: 400,
		});
	}
	return json({ status: 'idle', movies: result.data } as const);
}

export default function New() {
	// const actionData = useActionData<typeof action>();
	const data = useLoaderData<typeof loader>();
	console.log('🚀 ~ New ~ data:', data);

	return (
		<div className="p-4 font-sans">
			<h1 className="text-3xl">[TBD] New page</h1>

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
