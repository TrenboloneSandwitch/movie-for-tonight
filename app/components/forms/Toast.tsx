import { type FC, useEffect } from 'react';
import { Toaster as SonnerToaster, toast as showToast } from 'sonner';
import { type Toast } from '~/utils/toast.server';

export const Toaster: FC<{ toast?: Toast | null }> = ({ toast }) => {
	return (
		<>
			<SonnerToaster closeButton position="top-right" richColors />
			{toast ? <ShowToast toast={toast} /> : null}
		</>
	);
};

const ShowToast = ({ toast }: { toast: Toast }) => {
	const { id, type, title, description } = toast;
	useEffect(() => {
		setTimeout(() => {
			showToast[type](title, { id, description });
		}, 0);
	}, [description, id, title, type]);
	return null;
};
