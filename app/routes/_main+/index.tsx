import { type Movie } from '@prisma/client';
import {
	json,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node';

import { useLoaderData } from '@remix-run/react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { prisma } from '~/db.server';

const columnHelper = createColumnHelper<Pick<Movie, 'title'>>();

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

	const isSorting = typeof direction === 'string' && typeof id === 'string';

	const sorting: SortingState = isSorting
		? [{ desc: direction === 'desc', id }]
		: [];

	const movies = await prisma.movie.findMany({
		orderBy: { [id ?? 'createdAt']: direction ?? 'desc' },
	});

	console.log('🚀 ~ loader ~ movies:', id, direction);
	return json({ movies, sorting });
}

export default function Index() {
	const { movies, sorting } = useLoaderData<typeof loader>();
	const [sortState, setSorting] = useState(sorting);

	const handleSorting = (id, desc) => {
		console.log('🚀 ~ handleSorting ~ id, desc', id, desc);
	};

	const columns = useMemo(
		() => [
			columnHelper.accessor('title', {
				header: 'Title',
				cell: info => <div>asd{info.getValue()}</div>,
				enableSorting: true,
			}),
		],
		[],
	);

	const table = useReactTable({
		data: movies,
		state: { sorting },
		columns,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
	});

	return (
		<div className="p-4 font-sans">
			<h1 className="mb-4 text-2xl">[TBD] Hello world</h1>
			{sorting.direction}
			{sorting.id}
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<table className="w-full text-left text-sm rtl:text-right">
					<thead className="bg-accent text-xs uppercase text-primary">
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<th key={header.id} className="px-6 py-3">
										{header.isPlaceholder ? null : (
											<div
												className={
													header.column.getCanSort()
														? 'cursor-pointer select-none'
														: ''
												}
												onClick={header.column.getToggleSortingHandler()}
												title={
													header.column.getCanSort()
														? header.column.getNextSortingOrder() === 'asc'
															? 'Sort ascending'
															: header.column.getNextSortingOrder() === 'desc'
																? 'Sort descending'
																: 'Clear sort'
														: undefined
												}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{{
													asc: ' 🔼',
													desc: ' 🔽',
												}[header.column.getIsSorted() as string] ?? null}
											</div>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map(row => (
							<tr key={row.id} className="border-b text-primary">
								{row.getVisibleCells().map(cell => (
									<td key={cell.id} className="px-6 py-4">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
