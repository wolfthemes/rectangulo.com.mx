import { WP_ORIGIN } from '../lib/seo/site';

export function getSafeHttpUrl(value) {
	if (!value) return null;

	// A same-origin relative path (e.g. /videos/hero.mp4) — not "//host/...",
	// which `new URL` below would otherwise accept as protocol-relative to an
	// arbitrary host. Used as-is: whatever origin is serving the page.
	if (value.startsWith('/') && !value.startsWith('//')) return value;

	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
	} catch {
		return null;
	}
}

export function getSafeEmbedUrl(value) {
	const safeUrl = getSafeHttpUrl(value);
	if (!safeUrl) return null;

	const url = new URL(safeUrl);
	const hostname = url.hostname.replace(/^www\./, '');
	const allowedHosts = new Set([
		'youtube.com',
		'youtube-nocookie.com',
		'youtu.be',
		'vimeo.com',
		'player.vimeo.com',
	]);

	return allowedHosts.has(hostname) ? safeUrl : null;
}

// Last-resort fallback when a work has no video meta at all: the first
// self-hosted <video>/<source> src, or YouTube/Vimeo <iframe> src, found in
// its rendered post content (WP block editor video/embed blocks).
const CONTENT_VIDEO_PATTERN =
	/<(?:video|source)[^>]+src=["']([^"']+)["']|<iframe[^>]+src=["']([^"']*(?:youtube\.com|youtu\.be|vimeo\.com)[^"']*)["']/i;

export function extractContentVideoUrl(html) {
	const match = CONTENT_VIDEO_PATTERN.exec(html ?? '');
	return match ? match[1] || match[2] || null : null;
}

// A self-hosted video meta value on the backend origin that isn't a real
// Media Library upload (/wp-content/...) is actually a frontend-relative
// path that got saved with the backend domain in front of it — the backend
// has no such file, it only 302s unmatched paths to whatever frontend URL
// is configured there, which isn't guaranteed to resolve. Strip the backend
// origin so it loads same-origin instead (localhost in dev, the real domain
// in prod — see getSafeHttpUrl's same-origin branch), rather than relying on
// that redirect. A real Media Library file (/wp-content/...) is untouched:
// it only exists on the backend, so it has to keep loading from there.
export function resolveVideoFileUrl(value) {
	const url = getSafeHttpUrl(value);
	if (!url || !url.startsWith(WP_ORIGIN) || url.startsWith(`${WP_ORIGIN}/wp-content/`)) return url;

	const { pathname, search, hash } = new URL(url);
	return `${pathname}${search}${hash}`;
}
