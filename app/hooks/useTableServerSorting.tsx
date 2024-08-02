import { useSearchParams } from '@remix-run/react';
import { type SortingState } from '@tanstack/react-table';
import { type FC, useEffect } from 'react';

interface UseTableServerSortingProps {
	sorting: SortingState;
}

export const useTableServerSorting: FC<UseTableServerSortingProps> = ({
	sorting,
}) => {
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		if (sorting.length > 0) {
			params.set('sortBy', sorting[0].id);
			params.set('sortDirection', sorting[0].desc ? 'desc' : 'asc');
		} else {
			params.delete('sortBy');
			params.delete('sortDirection');
		}

		setSearchParams(params);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting]);

	return null;
};
