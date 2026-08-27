// Scroll-reveal for `.is-animated-heading` / `.is-animated-chars` /
// `.is-animated-lines` (see styles/_utilities.scss), split via SplitType.
// Content comes from raw WordPress HTML in some places (ContentWrapper's
// dangerouslySetInnerHTML) and from React elsewhere — this re-scans the DOM
// after each route change either way, instead of hooking individual React
// elements.
//
// Safety property: the base CSS never hides text on its own. Splitting (and
// therefore the per-word/char/line hidden state) only happens once SplitType
// has actually run and added `.is-split` — so if JS fails or hasn't run yet,
// text renders as plain, fully visible content instead of disappearing.
import SplitType from 'split-type';

let observer = null;

function getObserver() {
	if (observer) return observer;

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-in-view');
					observer.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
	);

	return observer;
}

function split(selector, { types, indexVar, unitKey }) {
	document.querySelectorAll(`${selector}:not(.is-split)`).forEach((el) => {
		const result = new SplitType(el, { types });

		result[unitKey]?.forEach((unit, index) => {
			unit.style.setProperty(indexVar, index);
		});

		el.classList.add('is-split');
		getObserver().observe(el);
	});
}

export function observeAnimatedHeadings() {
	if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

	split('.is-animated-heading', { types: 'words', indexVar: '--word-index', unitKey: 'words' });
	split('.is-animated-chars', { types: 'chars', indexVar: '--char-index', unitKey: 'chars' });
	split('.is-animated-lines', { types: 'lines', indexVar: '--line-index', unitKey: 'lines' });
}

// Same reveal-on-scroll mechanic as the split() helpers above, but for
// already-discrete elements (e.g. grid items) that don't need SplitType —
// the caller sets `--item-index` itself (see PortfolioGrid). Callers
// re-invoke this after their own async content (e.g. a GraphQL list) renders,
// since it isn't covered by the route-change scan in _app.js.
export function observeItemsInView(selector) {
	if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

	document.querySelectorAll(`${selector}:not(.is-observed)`).forEach((el) => {
		el.classList.add('is-observed');
		getObserver().observe(el);
	});
}
