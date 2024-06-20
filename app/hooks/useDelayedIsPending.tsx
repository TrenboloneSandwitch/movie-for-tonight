import { useSpinDelay } from 'spin-delay';
import { type UseIsPendingProps, useIsPending } from './useIsPending';

type UseDelayedIsPendingProps = UseIsPendingProps &
	Parameters<typeof useSpinDelay>[1];

export function useDelayedIsPending({
	formAction,
	formMethod,
	delay = 400,
	minDuration = 300,
}: UseDelayedIsPendingProps = {}) {
	const isPending = useIsPending({ formAction, formMethod });
	const delayedIsPending = useSpinDelay(isPending, {
		delay,
		minDuration,
	});
	return delayedIsPending;
}
