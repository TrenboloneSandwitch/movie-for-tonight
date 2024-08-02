import { clsx } from 'clsx';
import { type PropsWithChildren, forwardRef } from 'react';
import { useSpinDelay } from 'spin-delay';
import { StatusState } from '~/types';
import { Button, type ButtonProps } from './Button';
import { Icon } from './Icon';

interface StatusButtonProps extends ButtonProps {
	status: StatusState;
	message?: string | null;
	spinDelay?: Parameters<typeof useSpinDelay>[1];
}

const Status = ({
	status,
	spinDelay,
	children,
}: PropsWithChildren<{
	status: StatusState;
	spinDelay?: Parameters<typeof useSpinDelay>[1];
}>) => {
	const delayedPending = useSpinDelay(status === StatusState.PENDING, {
		delay: 400,
		minDuration: 300,
		...spinDelay,
	});

	if (status === StatusState.PENDING) {
		return (
			<div className="inline-flex items-center justify-center">
				{delayedPending ? (
					<div className="mr-1 h-6 w-6">
						<Icon name="update" className="animate-spin" />
					</div>
				) : (
					children
				)}
			</div>
		);
	}

	if (status === StatusState.SUCCESS) {
		return (
			<div className="pointer-events-none inline-flex h-6 w-6 cursor-auto items-center justify-center">
				<Icon name="check" />
			</div>
		);
	}

	if (status === StatusState.ERROR) {
		return (
			<div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive">
				<Icon name="cross-1" className="text-destructive-foreground" />
			</div>
		);
	}

	return (
		<div className="inline-flex items-center justify-center">{children}</div>
	);
};

export const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>(
	({ status, className, children, spinDelay, ...props }, ref) => {
		return (
			<Button
				ref={ref}
				className={clsx('flex justify-center gap-4', className)}
				{...props}
			>
				<Status status={status} spinDelay={spinDelay}>
					{children}
				</Status>
			</Button>
		);
	},
);
StatusButton.displayName = 'Button';
