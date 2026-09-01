import { forwardRef } from 'react';
import DOMPurify from 'isomorphic-dompurify';

const SANITIZE_OPTIONS = {
	USE_PROFILES: { html: true },
	FORBID_TAGS: ['form', 'iframe', 'object', 'embed', 'script', 'style'],
	FORBID_ATTR: ['style'],
};

// forwardRef: lets a caller attach a ref to find/act on elements inside the
// sanitized HTML (e.g. a CF7 shortcode's form, if one ever lands in
// dangerouslySetInnerHTML content) — a plain function component would
// silently drop that ref instead.
const SafeHtml = forwardRef(function SafeHtml(
	{ as: Tag = 'div', html = '', allowForms = false, ...props },
	ref
) {
	const options = allowForms
		? {
				...SANITIZE_OPTIONS,
				FORBID_TAGS: SANITIZE_OPTIONS.FORBID_TAGS.filter((tag) => tag !== 'form'),
			}
		: SANITIZE_OPTIONS;
	const sanitizedHtml = DOMPurify.sanitize(html, options);

	return <Tag ref={ref} {...props} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
});

export default SafeHtml;
