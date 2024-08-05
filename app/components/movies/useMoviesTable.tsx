import {
	createColumnHelper,
	getCoreRowModel,
	type RowSelectionState,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '~/hooks';
import { useTableServerSorting } from '~/hooks/useTableServerSorting';
import { type MainMoviesLoader } from '~/types';
import { Checkbox } from '../forms';
import { ScoreCard } from './ScoreCard';

const getColumns = () => {
	const columnHelper = createColumnHelper<MainMoviesLoader['movies'][0]>();

	return [
		columnHelper.display({
			id: 'select',
			enableSorting: false,
			header: ({
				table: {
					getIsAllRowsSelected,
					getIsSomeRowsSelected,
					getToggleAllRowsSelectedHandler,
				},
			}) => (
				<div className="flex justify-center align-middle">
					<Checkbox
						isIndeterminate={!getIsAllRowsSelected() && getIsSomeRowsSelected()}
						onClick={getToggleAllRowsSelectedHandler()}
						checked={getIsAllRowsSelected() || getIsSomeRowsSelected()}
					/>
				</div>
			),
			cell: ({ row }) => (
				<div className="flex justify-center align-middle">
					<Checkbox
						checked={row.getIsSelected()}
						disabled={!row.getCanSelect()}
						onClick={row.getToggleSelectedHandler()}
					/>
				</div>
			),
		}),
		columnHelper.accessor('title', {
			header: () => 'Title',
			cell: info => info.getValue(),
			enableSorting: true,
		}),
		columnHelper.accessor('releaseDate', {
			header: () => 'Release Date',
			cell: info => new Date(info.getValue()).getFullYear(),
			meta: { style: { textAlign: 'right' } },
			enableSorting: true,
		}),
		columnHelper.accessor('alreadySeen', {
			header: () => 'Seen',
			cell: info => (info.getValue() ? 'Yes' : 'No'),
			enableSorting: true,
		}),
		columnHelper.accessor('rating', {
			header: () => 'Rating',
			cell: info => <ScoreCard rating={info.getValue()} isTextColored />,
			meta: { style: { textAlign: 'right' } },
			enableSorting: true,
		}),
	];
};

export const useMoviesTable = ({ movies }: MainMoviesLoader) => {
	const columns = useMemo(getColumns, []);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [sorting, setSorting] = useState<SortingState>([]);
	const [debounceSorting, setDebounceSorting] = useState<SortingState>([]);

	const handleFormChange = useDebounce(() => setDebounceSorting(sorting), 400);

	useEffect(() => {
		handleFormChange();
	}, [sorting, handleFormChange]);

	const table = useReactTable({
		data: movies,
		enableRowSelection: true,
		state: { sorting, rowSelection },
		columns,
		onRowSelectionChange: setRowSelection,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
	});

	useTableServerSorting({ sorting: debounceSorting });
	return { table };
};
