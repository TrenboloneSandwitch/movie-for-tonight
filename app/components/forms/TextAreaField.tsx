import { useId } from 'react';
import { ErrorList, type ListOfErrors } from '../ErrorList';
import { Label } from './Label';
import { TextArea } from './TextArea';

export function TextAreaField({
	labelProps,
	textareaProps,
	errors,
	className,
}: {
	labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
	textareaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
	errors?: ListOfErrors;
	className?: string;
}) {
	const fallbackId = useId();
	const id = textareaProps.id ?? textareaProps.name ?? fallbackId;
	const errorId = errors?.length ? `${id}-error` : undefined;
	return (
		<div className={className}>
			<Label htmlFor={id} {...labelProps} />
			<TextArea
				id={id}
				aria-invalid={errorId ? true : undefined}
				aria-describedby={errorId}
				{...textareaProps}
			/>
			<div className="min-h-[32px] px-4 pb-3 pt-1">
				{errorId ? <ErrorList id={errorId} errors={errors} /> : null}
			</div>
		</div>
	);
}
