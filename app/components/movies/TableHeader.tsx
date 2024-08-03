import {
	flexRender,
	type Header,
	type SortDirection,
} from '@tanstack/react-table';
import clsx from 'clsx';

type TableHeaderProps<TData> = {
	header: Header<TData, unknown>;
	isPending: boolean;
};

const getTitle = (canSort: boolean, sortingOrder: SortDirection | false) => {
	if (!canSort) return undefined;
	if (sortingOrder === 'asc') return 'Sort ascending';
	if (sortingOrder === 'desc') return 'Sort descending';
	return 'Clear sort';
};

const getDirection = (sortedDirection: SortDirection | false) => {
	if (sortedDirection === 'asc') return ' 🔼';
	if (sortedDirection === 'desc') return ' 🔽';
	return null;
};

export const TableHeader = <T,>({ header, isPending }: TableHeaderProps<T>) => {
	const {
		getCanSort,
		getNextSortingOrder,
		getIsSorted,
		getToggleSortingHandler,
		columnDef,
	} = header.column;

	const canSort = getCanSort() && !isPending;
	const sortingDirection = getNextSortingOrder();
	const sortedDirection = getIsSorted();

	return (
		<th key={header.id} className="px-6 py-3">
			{header.isPlaceholder ? null : (
				<div
					className={clsx({ 'cursor-pointer select-none': canSort })}
					onClick={!isPending ? getToggleSortingHandler() : undefined}
					title={getTitle(canSort, sortingDirection)}
				>
					{flexRender(columnDef.header, header.getContext())}
					{getDirection(sortedDirection)}
				</div>
			)}
		</th>
	);
};
