import { clsx } from 'clsx';
import { type PropsWithChildren, forwardRef } from 'react';
import { useSpinDelay } from 'spin-delay';
import { Button, type ButtonProps } from './Button';
import { Icon } from './Icon';

export type Status = 'pending' | 'success' | 'error' | 'idle';

interface StatusButtonProps extends ButtonProps {
	status: Status;
	message?: string | null;
	spinDelay?: Parameters<typeof useSpinDelay>[1];
}

const Status = ({
	status,
	spinDelay,
	children,
}: PropsWithChildren<{
	status: Status;
	spinDelay?: Parameters<typeof useSpinDelay>[1];
}>) => {
	const delayedPending = useSpinDelay(status === 'pending', {
		delay: 400,
		minDuration: 300,
		...spinDelay,
	});

	console.log('🚀 ~ status:', status);
	if (status === 'pending') {
		return (
			<div className="inline-flex h-6 w-6 items-center justify-center">
				{delayedPending ? (
					<Icon name="update" className="animate-spin" />
				) : (
					children
				)}
			</div>
		);
	}

	if (status === 'success') {
		return (
			<div className="inline-flex h-6 w-6 items-center justify-center">
				<Icon name="check" />
			</div>
		);
	}

	if (status === 'error') {
		return (
			<div className="bg-destructive inline-flex h-6 w-6 items-center justify-center rounded-full">
				<Icon name="cross-1" className="text-destructive-foreground" />
			</div>
		);
	}

	return (
		<div className="inline-flex h-6 w-6 items-center justify-center">
			{children}
		</div>
	);
};

export const StatusButton = forwardRef<HTMLButtonElement, StatusButtonProps>(
	({ message, status, className, children, spinDelay, ...props }, ref) => {
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
