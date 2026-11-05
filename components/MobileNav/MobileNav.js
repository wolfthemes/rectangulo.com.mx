import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames/bind';
import NavigationMenu from '../NavigationMenu/NavigationMenu';
import { getLenis } from '../../lib/scroll';
import { useT } from '../../lib/i18n';
import styles from './MobileNav.module.scss';

let cx = classNames.bind(styles);

// Hamburger trigger + right-hand slide-in panel, shared by Header (inline,
// desktop-hidden) and HomeHero (its own fixed top-right mount, since Header
// itself is hidden on HOME — see Header.js). The backdrop/panel are portaled
// to <body> rather than left in place: Header sets position:relative with
// its own z-index (stacking context, for its dropdown menus), so left as a
// plain descendant the panel's z-index would only win *inside* that
// context — any later-painted sibling of Header with its own stacking
// context could still land on top of it. A portal sidesteps that entirely.
export default function MobileNav({ menuItems, className }) {
	const [isOpen, setIsOpen] = useState(false);
	// `document` exists on the client even during the very first hydration
	// pass, while SSR has no `document` at all — branching render output on
	// that directly (`typeof document !== 'undefined'`) renders the portal
	// on the client's first pass but not the server's, which is exactly the
	// "server HTML didn't match" hydration error. Gating on a flag that's
	// only ever flipped true after mount keeps that first client render
	// identical to the server's, and adds the portal one render later.
	const [mounted, setMounted] = useState(false);
	const t = useT();

	// eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: client-only mount flag, not a cascading-render bug.
	useEffect(() => setMounted(true), []);

	// Panel covers the viewport while open — lock the page behind it instead
	// of leaving two independent scroll positions to fight over. Lenis drives
	// scroll on top of (not instead of) the native one, so stopping only the
	// native scrollbar (documentElement.style.overflow) leaves Lenis free to
	// keep animating the page underneath — same pattern as VideoGrid's modal.
	useEffect(() => {
		if (!isOpen) return undefined;
		getLenis()?.stop();
		const { overflow } = document.documentElement.style;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			getLenis()?.start();
			document.documentElement.style.overflow = overflow;
		};
	}, [isOpen]);

	const close = () => setIsOpen(false);

	return (
		<div className={cx('component', className)}>
			<button
				type="button"
				className={cx('toggle')}
				onClick={() => setIsOpen(true)}
				aria-label={t({ es: 'Abrir menú', en: 'Open menu' })}
				aria-expanded={isOpen}
			>
				<span className={cx('bar')} />
				<span className={cx('bar')} />
				<span className={cx('bar')} />
			</button>

			{mounted &&
				createPortal(
					<>
						<div className={cx('backdrop', { open: isOpen })} onClick={close} aria-hidden="true" />

						<div className={cx('panel', { open: isOpen })} aria-hidden={!isOpen}>
							<div className={cx('menuWrap')}>
								<button
									type="button"
									className={cx('close')}
									onClick={close}
									aria-label={t({ es: 'Cerrar menú', en: 'Close menu' })}
									tabIndex={isOpen ? 0 : -1}
								>
									&times;
								</button>
								<NavigationMenu className={cx('menu')} menuItems={menuItems} onItemClick={close} />
							</div>
						</div>
					</>,
					document.body,
				)}
		</div>
	);
}
