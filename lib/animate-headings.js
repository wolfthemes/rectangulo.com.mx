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

const KINDS = [
	{ selector: '.is-animated-heading', types: 'words', indexVar: '--word-index', unitKey: 'words' },
	{ selector: '.is-animated-chars', types: 'chars', indexVar: '--char-index', unitKey: 'chars' },
	{ selector: '.is-animated-lines', types: 'lines', indexVar: '--line-index', unitKey: 'lines' },
];

// Splitting IS the hide step (adding `.is-split` is what makes the CSS in
// _utilities.scss hide the words/chars/lines) — so this must run as soon as
// content mounts, not deferred to whenever the reveal is meant to trigger.
// An above-the-fold heading sitting where a still-opening curtain's gap
// reaches early would otherwise flash plain text before it's ever hidden.
function splitOnly(selector, { types, indexVar, unitKey }) {
	document.querySelectorAll(`${selector}:not(.is-split)`).forEach((el) => {
		const result = new SplitType(el, { types });

		result[unitKey]?.forEach((unit, index) => {
			unit.style.setProperty(indexVar, index);
		});

		el.classList.add('is-split');
	});
}

export function splitAnimatedHeadings() {
	if (typeof window === 'undefined') return;
	KINDS.forEach(({ selector, ...opts }) => splitOnly(selector, opts));
}

// Registers already-split elements with the reveal observer — call once it's
// actually safe for the reveal to start (see lib/page-enter.js's onPageEnter).
export function observeAnimatedHeadings() {
	if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

	KINDS.forEach(({ selector }) => {
		document.querySelectorAll(`${selector}.is-split:not(.is-observed)`).forEach((el) => {
			el.classList.add('is-observed');
			getObserver().observe(el);
		});
	});
}
