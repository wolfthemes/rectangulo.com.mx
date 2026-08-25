// Scroll-reveal for `.is-animated-heading` (see styles/_utilities.scss), word
// by word via SplitType. Content comes from raw WordPress HTML in some
// places (ContentWrapper's dangerouslySetInnerHTML) and from React elsewhere
// — this re-scans the DOM after each route change either way, instead of
// hooking individual React elements.
//
// Safety property: the base CSS never hides text on its own. Splitting (and
// therefore the per-word hidden state) only happens once SplitType has
// actually run and added `.is-split` — so if JS fails or hasn't run yet,
// headings render as plain, fully visible text instead of disappearing.
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

export function observeAnimatedHeadings() {
	if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

	document.querySelectorAll('.is-animated-heading:not(.is-split)').forEach((el) => {
		const split = new SplitType(el, { types: 'words' });

		split.words?.forEach((word, index) => {
			word.style.setProperty('--word-index', index);
		});

		el.classList.add('is-split');
		getObserver().observe(el);
	});
}
