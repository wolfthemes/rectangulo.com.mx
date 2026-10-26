import { NextResponse } from 'next/server';

// Geo-detect visitors outside the Spanish-speaking world on the bare home URL
// and send them to /en, once. The redirect sets NEXT_LOCALE, and the ES | EN
// switcher sets the same cookie, so an explicit choice is never overridden.
// ponytail: Vercel's x-vercel-ip-country header; no header (local dev) = no redirect.
// The matcher '/' also matches /en (locale prefixes are stripped before matching),
// so only the Spanish home may redirect — otherwise /en would loop. Crawlers are
// never redirected, nor is anyone whose browser prefers Spanish (a Mexican abroad).
const SPANISH_COUNTRIES = new Set([
	'MX', 'ES', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO',
	'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ',
]);

export function proxy(request) {
	if (request.nextUrl.locale !== 'es') return NextResponse.next();
	if (request.cookies.has('NEXT_LOCALE')) return NextResponse.next();
	if (/bot|crawl|spider|google/i.test(request.headers.get('user-agent') ?? ''))
		return NextResponse.next();
	if (/^\s*es\b/i.test(request.headers.get('accept-language') ?? '')) return NextResponse.next();

	const country = request.headers.get('x-vercel-ip-country');
	if (country && !SPANISH_COUNTRIES.has(country)) {
		const response = NextResponse.redirect(new URL('/en', request.url));
		response.cookies.set('NEXT_LOCALE', 'en', {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax',
		});
		return response;
	}
	return NextResponse.next();
}

export const config = { matcher: '/' };
