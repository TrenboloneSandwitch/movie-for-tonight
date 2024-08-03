import { type Movie } from '@prisma/client';
import {
	createColumnHelper,
	getCoreRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '~/hooks';
import { useTableServerSorting } from '~/hooks/useTableServerSorting';
import { type MainMoviesLoader } from '~/types';

const getColumnHelper = () => createColumnHelper<Pick<Movie, 'title'>>();

const getColumns = () => [
	getColumnHelper().accessor('title', {
		header: 'Title',
		cell: info => <div>{info.getValue()}</div>,
		enableSorting: true,
	}),
];

export const useMoviesTable = ({ movies }: MainMoviesLoader) => {
	const columns = useMemo(getColumns, []);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [debounceSorting, setDebounceSorting] = useState<SortingState>([]);

	const handleFormChange = useDebounce(() => setDebounceSorting(sorting), 400);

	useEffect(() => {
		handleFormChange();
	}, [sorting, handleFormChange]);

	const table = useReactTable({
		data: movies,
		state: { sorting },
		columns,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
	});

	useTableServerSorting({ sorting: debounceSorting });
	return { table };
};
