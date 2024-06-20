import  { type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: '[TBD] Hello world' },
		{ name: 'description', content: '[TBD] Welcome to Remix!' },
	];
};

export default function Index() {
	return (
		<div className="p-4 font-sans">
			<h1 className="text-3xl">[TBD] Hello world</h1>
		</div>
	);
}
