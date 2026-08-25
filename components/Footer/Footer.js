import classNames from 'classnames/bind';
import { Container, NavigationMenu } from '../../components';
import styles from './Footer.module.scss';

let cx = classNames.bind(styles);

// ponytail: contact email/phone and socials are hardcoded — no WP field for
// them yet (an options page/ACF global would be the natural home). Move
// these to props once that source exists.
const CONTACT_EMAIL = 'contacto@rectangulo.com.mx';
const CONTACT_PHONE = '+52 3323 88 1333';
const SOCIAL_LINKS = [
	{ label: 'Instagram', href: 'https://instagram.com/rectangulo' },
	{ label: 'TikTok', href: 'https://tiktok.com/@rectangulo' },
	{ label: 'YouTube', href: 'https://youtube.com/@rectangulo' },
];

export default function Footer({ title, menuItems }) {
	const year = new Date().getFullYear();

	return (
		<footer className={cx('component')}>
			<Container>
				<div className={cx('top')}>
					<NavigationMenu className={cx('nav')} menuItems={menuItems} />

					<div className={cx('column')}>
						<h2 className={cx('heading')}>Get in touch</h2>
						<a className={cx('link')} href={`mailto:${CONTACT_EMAIL}`}>
							{CONTACT_EMAIL}
						</a>
						<a className={cx('link')} href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}>
							{CONTACT_PHONE}
						</a>
					</div>

					<div className={cx('column')}>
						<h2 className={cx('heading')}>Follow us</h2>
						{SOCIAL_LINKS.map(({ label, href }) => (
							<a key={label} className={cx('link')} href={href} target="_blank" rel="noreferrer">
								{label}
							</a>
						))}
					</div>
				</div>

				<div className={cx('bottom')}>
					<p className={cx('copyright')}>{`${title} © ${year}. Powered by Headless WordPress.`}</p>
					<p className={cx('credit')}>Made by Rectángulo</p>
				</div>
			</Container>
		</footer>
	);
}
