import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import clsx from 'clsx';
import {
	type ComponentPropsWithoutRef,
	type ElementRef,
	forwardRef,
} from 'react';
import { Icon } from '../ui';

interface CheckboxProps
	extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

export const Checkbox = forwardRef<
	ElementRef<typeof CheckboxPrimitive.Root>,
	CheckboxProps
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		{...props}
		ref={ref}
		className={clsx(
			'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			className,
		)}
	>
		<div>
			<CheckboxPrimitive.Indicator
				className={clsx(
					'flex max-h-2 items-center justify-center text-current',
				)}
			>
				<Icon name="check" />
			</CheckboxPrimitive.Indicator>
		</div>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';
