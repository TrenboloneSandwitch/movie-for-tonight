import { useFormAction, useNavigation } from '@remix-run/react';

interface UseIsPendingProps {
	formAction?: string;
	formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
	state?: 'submitting' | 'loading' | 'non-idle';
}

export function useIsPending({
	formAction,
	formMethod = 'POST',
	state = 'non-idle',
}: UseIsPendingProps = {}) {
	const contextualFormAction = useFormAction();
	const navigation = useNavigation();

	const isPendingState =
		state === 'non-idle'
			? navigation.state !== 'idle'
			: navigation.state === state;

	return (
		isPendingState &&
		navigation.formAction === (formAction ?? contextualFormAction) &&
		navigation.formMethod === formMethod
	);
}
