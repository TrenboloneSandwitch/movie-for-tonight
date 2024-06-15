import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';
import stylesheet from './tailwind.css?url';
import { LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
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
	const year = new Date().getFullYear();
	return (
		<Layout>
			<div className="flex h-screen flex-col items-center justify-between">
				<header className="w-full bg-slate-800 p-4 py-6 text-white">
					<nav>
						<div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
							[TBD] Movie night 🍿
						</div>
					</nav>
				</header>

				<div className="container flex-1">
					<Outlet />
				</div>

				<footer className="w-full bg-slate-800 p-4 text-center text-white">
					<p>© {year} Jan Soldát</p>
				</footer>
			</div>
		</Layout>
	);
}
