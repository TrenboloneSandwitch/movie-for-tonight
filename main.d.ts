import '@tanstack/react-table';

declare module '@tanstack/table-core' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		style: {
			textAlign: 'left' | 'center' | 'right';
		};
	}
}
