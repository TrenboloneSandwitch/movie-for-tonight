import { type FC } from 'react';

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

interface ErrorListProps {
	id?: string;
	errors?: ListOfErrors;
}

export const ErrorList: FC<ErrorListProps> = ({ id, errors }) => {
	const errorsToRender = errors?.filter(Boolean);

	if (!errorsToRender?.length) return null;

	return (
		<ul id={id} className="flex flex-col gap-1">
			{errorsToRender.map(e => (
				<li key={e} className="text-foreground-destructive text-[10px]">
					{e}
				</li>
			))}
		</ul>
	);
};
