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
