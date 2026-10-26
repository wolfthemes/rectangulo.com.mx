const { withFaust, getWpHostname } = require('@faustwp/core');
const { createSecureHeaders } = require('next-secure-headers');

const wordpressUrl = new URL(process.env.NEXT_PUBLIC_WORDPRESS_URL);

/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
	reactStrictMode: true,
	// ponytail: inotify doesn't reliably fire for edits on WSL2's /mnt/c
	// Windows-mounted filesystem, so webpack's dev-mode file watcher misses
	// changes without polling. Only affects local dev on this filesystem.
	webpack: (config, { dev }) => {
		if (dev) {
			config.watchOptions = { poll: 800, aggregateTimeout: 300 };
		}
		return config;
	},
	sassOptions: {
		// ponytail: sass-loader v16 (Next 16) defaults to the modern Sass API,
		// which reads `loadPaths` — `includePaths` is legacy-API-only and is
		// silently ignored, breaking bare `@import 'styles/...'`.
		loadPaths: [__dirname, 'node_modules'],
	},
	images: {
		remotePatterns: [
			{
				protocol: wordpressUrl.protocol.replace(':', ''),
				hostname: getWpHostname(),
				port: wordpressUrl.port,
				pathname: '/wp-content/uploads/**',
			},
		],
	},
	i18n: {
		locales: ['es', 'en'],
		defaultLocale: 'es',
		// Spanish is the site's language: don't redirect visitors to /en from
		// their browser's Accept-Language — English is opt-in via the switcher.
		localeDetection: false,
	},
	async headers() {
		return [
			// Non-production: keep every response (assets included) out of the index.
			...(process.env.NEXT_PUBLIC_SITE_ENV === 'production'
				? []
				: [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]),
			{
				source: '/:path*',
				headers: createSecureHeaders({
					xssProtection: false,
				}),
			},
		];
	},
});
