import { FC, useId } from 'react';
import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import { Label } from './forms/Label';
import { Input } from './forms/Input';
import { Icon } from './Icon';
import { StatusButton, Status } from './StatusButton';
import { useDebounce, useIsPending } from '~/hooks';

interface SearchBarProps {
	autoFocus: boolean;
	autoSubmit: boolean;
	formAction: `/${string}`;
	status: Status;
}

export const SearchBar: FC<SearchBarProps> = ({
	autoFocus,
	formAction,
	autoSubmit,
	status,
}) => {
	const id = useId();
	const [searchParams] = useSearchParams();
	const submit = useSubmit();

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		submit(form);
	}, 400);
	const isSubmitting = useIsPending({ formMethod: 'GET', formAction });

	return (
		<Form
			method="GET"
			action={formAction}
			className="flex flex-wrap items-center justify-center gap-2"
			onChange={e => autoSubmit && handleFormChange(e.currentTarget)}
		>
			<div className="flex-1">
				<Label htmlFor={id} className="sr-only">
					Search
				</Label>
				<Input
					type="search"
					name="search"
					id={id}
					defaultValue={searchParams.get('search') ?? ''}
					placeholder="Search"
					className="w-full"
					autoFocus={autoFocus}
				/>
			</div>
			<div>
				<StatusButton
					type="submit"
					status={isSubmitting ? 'pending' : status}
					className="flex w-full items-center justify-center"
					size="sm"
				>
					<Icon name="magnifying-glass" size="sm" />
					<span className="sr-only">Search</span>
				</StatusButton>
			</div>
		</Form>
	);
};
