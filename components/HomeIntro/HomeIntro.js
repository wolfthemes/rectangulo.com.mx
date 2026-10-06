import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './HomeIntro.module.scss';

let cx = classNames.bind(styles);

// ponytail: a plain dismissible overlay, not wired into the PageTransition
// curtain system yet (lib/page-enter.js) — brief section 02 just needs a
// branded entry gate before HOME reveals; hook it into that engine once the
// curtain choreography extends to a first-visit "enter site" state.
const SKIP_KEY = 'rectangulo:intro-seen';

// Lazy initializer, not an effect: reads sessionStorage once, synchronously,
// before first paint — an effect-driven setState here would cost an extra
// render pass and still let the overlay flash open for a frame first.
function initialOpen() {
	if (typeof window === 'undefined') return false;
	try {
		return !sessionStorage.getItem(SKIP_KEY);
	} catch {
		// Storage blocked (private mode, etc.) — show the intro every time.
		return true;
	}
}

export default function HomeIntro({ title = 'Rectángulo' }) {
	const [open, setOpen] = useState(initialOpen);

	const enter = () => {
		setOpen(false);
		try {
			sessionStorage.setItem(SKIP_KEY, '1');
		} catch {
			// Nothing to persist — intro just replays next load.
		}
	};

	if (!open) return null;

	return (
		<div className={cx('component')} role="dialog" aria-modal="true" aria-label={`${title} — intro`}>
			{/* eslint-disable-next-line @next/next/no-img-element -- brand mark, not content */}
			<img className={cx('logo')} src="/images/logo.svg" alt={title} />
			<button type="button" className={cx('enter')} onClick={enter}>
				Enter <span aria-hidden="true">→</span>
			</button>
		</div>
	);
}
