// The page-enter reveal engine. Entrance content (grid items, hero media…)
// registers itself as it mounts and gets hidden via gsap.set immediately —
// same trick PageTransition's own curtain bars use: a direct GSAP style, not
// a CSS class, so there's no flash-of-visible-before-hidden race waiting on
// a browser paint. PageTransition then plays everything registered at one
// deterministic point in its own timeline (see playPageEnter's call site) —
// a single direct tween, not an eventual per-element IntersectionObserver
// callback. (IntersectionObserver is still the right tool for genuine
// below-fold scroll-reveal — see lib/animate-headings.js — this engine is
// only for "reveal exactly when the curtain says so".)
import gsap from 'gsap';

let open = true; // no curtain on first paint — anything registering now just plays
let pendingReveals = [];
let pendingCallbacks = [];

const DEFAULT_FROM = { opacity: 0, y: 32 };
const DEFAULT_TO = { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' };

// `selector` is a CSS selector string (queried immediately) or an existing
// element/array/NodeList. Call from useLayoutEffect, not useEffect, so the
// hidden state in `from` lands before the browser's first paint.
export function revealOnEnter(selector, { from = DEFAULT_FROM, ...to } = {}) {
	const els = typeof selector === 'string' ? gsap.utils.toArray(selector) : selector;
	if (!els || (els.length ?? 1) === 0) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	gsap.set(els, from);
	const tweenVars = { ...DEFAULT_TO, ...to };

	if (open) {
		gsap.to(els, tweenVars);
		return;
	}
	pendingReveals.push({ els, tweenVars });
}

// For content that manages its own hidden state (e.g. animate-headings.js's
// CSS-class + IntersectionObserver split/reveal) but still needs to know
// *when* it's safe to start — same timing signal, plain callback instead of
// an element batch.
export function onPageEnter(fn) {
	if (open) {
		fn();
		return;
	}
	pendingCallbacks.push(fn);
}

export function pageEnterClosing() {
	open = false;
}

export function playPageEnter() {
	open = true;
	const reveals = pendingReveals;
	const callbacks = pendingCallbacks;
	pendingReveals = [];
	pendingCallbacks = [];
	reveals.forEach(({ els, tweenVars }) => gsap.to(els, tweenVars));
	callbacks.forEach((fn) => fn());
}
