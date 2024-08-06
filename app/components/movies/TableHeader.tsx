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

const getSortTitle = (
	canSort: boolean,
	sortingOrder: SortDirection | false,
) => {
	if (!canSort) return undefined;
	if (sortingOrder === 'asc') return 'Sort ascending';
	if (sortingOrder === 'desc') return 'Sort descending';
	return 'Clear sort';
};

export const getDirection = (sortedDirection: SortDirection | false) => {
	if (sortedDirection === 'asc') return ' 🔼';
	if (sortedDirection === 'desc') return ' 🔽';
	return null;
};

export const TableHeader = <T,>({ header, isPending }: TableHeaderProps<T>) => {
	const { column, id, isPlaceholder, getContext } = header;

	const {
		getCanSort,
		getNextSortingOrder,
		getIsSorted,
		getToggleSortingHandler,
		columnDef,
	} = column;

	const canSort = getCanSort() && !isPending;
	const sortingDirection = getNextSortingOrder();
	const sortedDirection = getIsSorted();

	return (
		<th
			key={id}
			title={getSortTitle(canSort, sortingDirection)}
			className={clsx('px-4 py-3', { 'cursor-pointer select-none': canSort })}
			onClick={!isPending ? getToggleSortingHandler() : undefined}
			align={columnDef.meta?.style.textAlign}
		>
			{!isPlaceholder && (
				<>
					{flexRender(columnDef.header, getContext())}
					{getDirection(sortedDirection)}
				</>
			)}
		</th>
	);
};
