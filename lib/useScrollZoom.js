import { useEffect, useRef } from 'react';
import { onScrollFrame } from './scroll';

function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

// Scroll-linked translate/scale on an image within a section, driven by the
// same Lenis-backed scroll loop the rest of the site uses (lib/scroll.js)
// rather than a new animation dependency. Shared by ParallaxSection (full
// parallax drift + zoom) and AboutGallery (zoom only, translateRange: 0).
export function useScrollZoom({ translateRange = 60, scaleRange = 0.1 } = {}) {
	const sectionRef = useRef(null);
	const imageRef = useRef(null);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

		return onScrollFrame(() => {
			const section = sectionRef.current;
			const image = imageRef.current;
			if (!section || !image) return;

			const rect = section.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			// 0 as the section's top enters the bottom of the viewport, 1 as its
			// bottom leaves the top — i.e. progress through being on screen.
			const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);

			const translateY = (progress - 0.5) * translateRange;
			const scale = 1 + scaleRange - progress * scaleRange;

			image.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
		});
	}, [translateRange, scaleRange]);

	return { sectionRef, imageRef };
}
