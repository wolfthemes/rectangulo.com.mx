import { useState } from 'react';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { Container, NavigationMenu, SkipNavigationLink } from '../../components';
import styles from './Header.module.scss';

let cx = classNames.bind(styles);

// ponytail: `hidden` (display:none) hides the default nav on HOME while
// HomeHero's own fixed wordmark+nav stands in for it — temporary until
// HOME's mobile nav story (this also removes the hamburger toggle) gets
// sorted out for good.
export default function Header({ title = 'Rectángulo', menuItems, hidden }) {
	const [isNavShown, setIsNavShown] = useState(false);

	return (
		<header className={cx('component', { hidden })}>
			<SkipNavigationLink />
			<Container>
				<div className={cx('navbar')}>
					<div className={cx('brand')}>
						<Link legacyBehavior href="/">
							<a className={cx('title')}>
								{/* eslint-disable-next-line @next/next/no-img-element -- brand mark, not content */}
								<img className={cx('logo')} src="/images/logo.svg" alt={title} />
							</a>
						</Link>
					</div>
					<button
						type="button"
						className={cx('nav-toggle')}
						onClick={() => setIsNavShown(!isNavShown)}
						aria-label="Toggle navigation"
						aria-controls={cx('primary-navigation')}
						aria-expanded={isNavShown}
					>
						☰
					</button>
					<NavigationMenu
						className={cx(['primary-navigation', isNavShown ? 'show' : undefined])}
						menuItems={menuItems}
						onItemClick={() => setIsNavShown(false)}
					/>
				</div>
			</Container>
		</header>
	);
}
