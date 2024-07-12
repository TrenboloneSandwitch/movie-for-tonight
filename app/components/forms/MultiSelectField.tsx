import { type FC, useId } from 'react';
import { ErrorList, type ListOfErrors } from '../ErrorList';
import { Label } from './Label';
import { MultiSelect, type MultiSelectProps } from './MultiSelect';

interface MultiSelectFieldProps extends MultiSelectProps {
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
	errors?: ListOfErrors;
	className?: string;
	id?: string;
	name?: string;
}

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
	labelProps,
	errors,
	className,
	id,
	name,
	...props
}) => {
	const fallbackId = useId();
	const htmlFor = id ?? name ?? fallbackId;
	const errorId = errors?.length ? `${id}-error` : undefined;
	return (
		<div className={className}>
			<Label htmlFor={htmlFor} {...labelProps} />
			<MultiSelect {...props} />
			<div className="min-h-[32px] px-4 pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	);
};
