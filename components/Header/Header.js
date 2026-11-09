import classNames from 'classnames/bind';
import Link from 'next/link';
import { Container, LanguageSwitcher, MobileNav, NavigationMenu, SkipNavigationLink } from '../../components';
import styles from './Header.module.scss';

let cx = classNames.bind(styles);

// ponytail: `hidden` (display:none) hides the default nav on HOME while
// HomeHero's own fixed wordmark + MobileNav mount stands in for it — see
// Header.js's usage there.
export default function Header({ menuItems, hidden }) {
	return (
		<header className={cx('component', { hidden })}>
			<SkipNavigationLink />
			<Container>
				<div className={cx('navbar')}>
					<div className={cx('brand')}>
						<Link legacyBehavior href="/">
							<a className={cx('title')}>
								<span className={cx('logo')}>REECTANGULOO</span>
							</a>
						</Link>
					</div>
					<LanguageSwitcher className={cx('lang')} />
					<NavigationMenu className={cx('primary-navigation')} menuItems={menuItems} />
					<MobileNav menuItems={menuItems} />
				</div>
			</Container>
		</header>
	);
}
