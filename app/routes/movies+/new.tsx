import { parseWithZod } from '@conform-to/zod';
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node';
import { json, redirect, useLoaderData } from '@remix-run/react';
import { useState } from 'react';
import { discoverMovie$ } from '~/api';
import { FormView, MovieSchema } from '~/components/movies/FormView';
import { SearchView } from '~/components/movies/SearchView';
import {
	type HandleMovieSelect,
	type SelectedMovie,
} from '~/components/movies/types';
import { prisma } from '~/db.server';
import { StatusState } from '~/types';

export const meta: MetaFunction = () => {
	return [
		{ title: '[TBD] Add page' },
		{ name: 'description', content: '[TBD] Add page description!' },
	];
};

export async function action({ request }: ActionFunctionArgs) {
	// const userId = await requireUserId(request);
	// await requireNoPassword(userId);

	const formData = await request.formData();
	const submission = await parseWithZod(formData, {
		async: true,
		schema: MovieSchema,
	});

	//   id          String   @id @default(cuid())
	// apiId       Int
	// title       String
	// description String
	// releaseDate DateTime
	// alreadySeen Boolean
	// rating      Int
	// genres      Genre[]
	// profilePic  String
	// author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade, onUpdate: Cascade)
	// authorId    String
	// createdAt   DateTime @default(now())
	// updatedAt   DateTime @updatedAt

	if (submission.status === 'success') {
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
				author: {
					connect: {
						id: '1',
					},
				},
			},
		});

		return json({ status: 'success', submission } as const, { status: 200 });
	}

	if (!submission.status || submission.status === 'error') {
		return json({ status: 'error', submission } as const, { status: 400 });
	}

	return json({ status: 'idle', submission } as const);
}

// 	// if (submission.status ) {
// 	// 	// clear the value so we don't send the password back to the client
// 	// 	submission.value = undefined;
// 	// 	return json({ status: 'idle', submission } as const);
// 	// }
// 	// if (!submission.value) {
// 	// 	return json({ status: 'error', submission } as const, { status: 400 });
// 	// }

// 	// const { password } = submission.value;

// 	// await prisma.user.update({
// 	// 	select: { username: true },
// 	// 	where: { id: userId },
// 	// 	data: {
// 	// 		password: {
// 	// 			create: {
// 	// 				hash: await getPasswordHash(password),
// 	// 			},
// 	// 		},
// 	// 	},
// 	// });

// 	// return redirect(`/settings/profile`, { status: 302 });
// }

// export async function action({ request }: ActionFunctionArgs) {
// 	// const userId = await requireUserId(request);
// 	// await requireNoPassword(userId);
// 	const formData = await request.formData();
// 	const submission = await parseWithZod(formData, {
// 		async: true,
// 		schema: MovieSchema,
// 	});
// 	// clear the payload so we don't send the password back to the client
// 	submission.payload = {};
// 	console.log('🚀 ~ action ~ submission:', submission);
// 	return redirect('/');

// 	// if (submission.status ) {
// 	// 	// clear the value so we don't send the password back to the client
// 	// 	submission.value = undefined;
// 	// 	return json({ status: 'idle', submission } as const);
// 	// }
// 	// if (!submission.value) {
// 	// 	return json({ status: 'error', submission } as const, { status: 400 });
// 	// }

// 	// const { password } = submission.value;

// 	// await prisma.user.update({
// 	// 	select: { username: true },
// 	// 	where: { id: userId },
// 	// 	data: {
// 	// 		password: {
// 	// 			create: {
// 	// 				hash: await getPasswordHash(password),
// 	// 			},
// 	// 		},
// 	// 	},
// 	// });

// 	// return redirect(`/settings/profile`, { status: 302 });
// }

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
