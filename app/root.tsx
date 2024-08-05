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
import { Toaster, GeneralProgressBar } from './components/ui';
import stylesheet from './tailwind.css?url';
import { csrf } from './utils/csrf.server';
import { honeypot } from './utils/honeypot.server';
import { combineHeaders } from './utils/misc';
import { getToast } from './utils/toast.server';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
	const honeyProps = honeypot.getInputProps();
	const [csrfToken, csrfCookieHeader] = await csrf.commitToken();

	const { toast, headers: toastHeaders } = await getToast(request);

	return json(
		{
			requestInfo: {
				path: new URL(request.url).pathname,
			},
			toast,
			honeyProps,
			csrfToken,
		},
		{
			headers: combineHeaders(
				toastHeaders,
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
		'line-clamp-2 block py-2 pl-8 pr-6 text-base lg:text-xl cursor-pointer';
	const activeNavLinkClassName = 'bg-accent cursor-default';

	return (
		<AuthenticityTokenProvider token={data.csrfToken}>
			<HoneypotProvider {...data.honeyProps}>
				<Document>
					<div className="flex h-screen flex-col items-center justify-between">
						<header className="w-full bg-muted p-4 py-6">
							<nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
								<h1 className="">[TBD] Movie night 🍿</h1>
								<ul className="flex overflow-y-auto overflow-x-hidden">
									<li className="p-1 pr-0">
										<NavLink
											to="/"
											className={({ isActive }) =>
												clsx(navLinkDefaultClassName, {
													[activeNavLinkClassName]: isActive,
												})
											}
										>
											Home
										</NavLink>
									</li>
									<li className="p-1 pr-0">
										<NavLink
											to="movies/new"
											className={({ isActive }) =>
												clsx(navLinkDefaultClassName, {
													[activeNavLinkClassName]: isActive,
												})
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
					<Toaster toast={data.toast} />
					<GeneralProgressBar />
				</Document>
			</HoneypotProvider>
		</AuthenticityTokenProvider>
	);
}
