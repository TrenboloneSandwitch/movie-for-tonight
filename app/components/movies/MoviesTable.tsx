import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { type FC } from 'react';
import { useIsPending } from '~/hooks';
import { type MainMoviesLoader } from '~/types';
import { TableHeader } from './TableHeader';
import { useMoviesTable } from './useMoviesTable';

export const MoviesTable: FC<MainMoviesLoader> = ({ movies }) => {
	const { table } = useMoviesTable({ movies });
	const isPending = useIsPending({ skipFormCheck: true });

	return (
		<div className="p-4 font-sans">
			<h1 className="mb-4 text-2xl">[TBD] Hello world</h1>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<table
					className={clsx('w-full text-left text-sm rtl:text-right', {
						'opacity-50': isPending,
					})}
				>
					<thead className="bg-secondary text-xs uppercase text-primary">
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHeader
										key={header.id}
										header={header}
										isPending={isPending}
									/>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map(row => (
							<tr
								key={row.id}
								className={clsx('border-b text-primary hover:bg-muted', {
									'bg-accent': row.getIsSelected(),
								})}
							>
								{row.getVisibleCells().map(cell => (
									<td
										key={cell.id}
										className="px-4 py-1"
										align={cell.column.columnDef.meta?.style.textAlign}
									>
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
};
