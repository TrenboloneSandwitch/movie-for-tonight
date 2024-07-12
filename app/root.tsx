import { type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node';
import {
	Links,
	Meta,
	NavLink,
	Outlet,
	Scripts,
	ScrollRestoration,
	json,
	useLoaderData,
} from '@remix-run/react';
import clsx from 'clsx';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import { GeneralProgressBar } from './components/GeneralProgressBar';
import stylesheet from './tailwind.css?url';
import { csrf } from './utils/csrf.server';
import { honeypot } from './utils/honeypot.server';
import { combineHeaders } from './utils/misc';
import { makeTimings } from './utils/timing.server';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
	const timings = makeTimings('root loader');

	const honeyProps = honeypot.getInputProps();
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken();

	return json(
		{
			requestInfo: {
				path: new URL(request.url).pathname,
			},
			honeyProps,
			csrfToken,
		},
		{
			headers: combineHeaders(
				{ 'Server-Timing': timings.toString() },
				csrfCookieHeader ? { 'set-cookie': csrfCookieHeader } : null,
			),
		},
	);
}

export function Document({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const data = useLoaderData<typeof loader>();

	const year = new Date().getFullYear();
	const navLinkDefaultClassName =
		'line-clamp-2 block rounded-l-full py-2 pl-8 pr-6 lg:text-xl';

	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<HoneypotProvider {...data.honeyProps}>
				<Document>
					<div className="flex h-screen flex-col items-center justify-between">
						<header className="w-full bg-slate-800 p-4 py-6 text-white">
							<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
								<div className="">[TBD] Movie night 🍿</div>
								<ul className="overflow-y-auto overflow-x-hidden">
									<li className="p-1 pr-0">
										<NavLink
											to="movies/new"
											className={({ isActive }) =>
												clsx(
													navLinkDefaultClassName,
													isActive && 'text-green-500',
												)
											}
										>
											Add
										</NavLink>
									</li>
								</ul>
							</nav>
						</header>

						<div className="container flex-1">
							<Outlet />
						</div>

						<footer className="w-full bg-slate-800 p-4 text-center text-white">
							<p>© {year} Jan Soldát</p>
						</footer>
					</div>
					<GeneralProgressBar />
				</Document>
			</HoneypotProvider>
		</AuthenticityTokenProvider>
	);
}
