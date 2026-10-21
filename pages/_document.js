import { Html, Head, Main, NextScript } from 'next/document';

// Inline, not CSS: this must paint before any stylesheet loads (dev mode
// injects CSS via JS, so the external-stylesheet version in _base.scss left
// a white flash first). #ec233c mirrors --wpe--color--accent (_css-variables.scss) —
// the var itself isn't available this early.
export default function Document() {
	return (
		<Html lang="en" style={{ backgroundColor: '#ec233c' }}>
			<Head />
			<body style={{ backgroundColor: '#ec233c' }}>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
