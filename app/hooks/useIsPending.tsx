import { useFormAction, useNavigation } from '@remix-run/react';
import { HTMLStatus } from '~/types';

export interface UseIsPendingProps {
	formAction?: string;
	formMethod?: HTMLStatus;
	state?: 'submitting' | 'loading' | 'non-idle';
	skipFormCheck?: boolean;
}

export function useIsPending({
	formAction,
	formMethod = HTMLStatus.POST,
	state = 'non-idle',
	skipFormCheck = false,
}: UseIsPendingProps = {}) {
	const contextualFormAction = useFormAction();
	const navigation = useNavigation();

	const isPendingState =
		state === 'non-idle'
			? navigation.state !== 'idle'
			: navigation.state === state;

	if (skipFormCheck) {
		return isPendingState;
	}

	return (
		isPendingState &&
		navigation.formAction === (formAction ?? contextualFormAction) &&
		navigation.formMethod === formMethod
	);
}
