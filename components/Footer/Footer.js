import classNames from 'classnames/bind';
import Link from 'next/link';
import { Container, NavigationMenu } from '../../components';
import { CONTACT_EMAIL, CONTACT_PHONE, LOCATION, SOCIAL_LINKS } from '../../constants/contact';
import { useT } from '../../lib/i18n';
import styles from './Footer.module.scss';

let cx = classNames.bind(styles);


export default function Footer({ title, menuItems }) {
	const year = new Date().getFullYear();
	const t = useT();

	return (
		<footer className={cx('component')}>
			<Container>
				<div className={cx('top')}>
					<NavigationMenu className={cx('nav')} menuItems={menuItems} />

					<div className={cx('column')}>
						<h2 className={cx('heading')}>{t({ es: 'Contáctanos', en: 'Get in touch' })}</h2>
						<a className={cx('link')} href={`mailto:${CONTACT_EMAIL}`}>
							{CONTACT_EMAIL}
						</a>
						<a className={cx('link')} href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}>
							{CONTACT_PHONE}
						</a>
						<p className={cx('link')}>{t(LOCATION)}</p>
					</div>

					<div className={cx('column')}>
						<h2 className={cx('heading')}>{t({ es: 'Síguenos', en: 'Follow us' })}</h2>
						{SOCIAL_LINKS.map(({ short, label, href }) => (
							<a key={short} className={cx('link')} href={href} target="_blank" rel="noreferrer" aria-label={label}>
								{short}
								<svg
									className={cx('external-icon')}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M7 17 17 7M17 7H7M17 7v10" />
								</svg>
							</a>
						))}
					</div>
				</div>

				<div className={cx('bottom')}>
					<p className={cx('copyright')}>{`${title} © ${year}`}</p>
					<nav className={cx('legal')} aria-label={t({ es: 'Legal', en: 'Legal' })}>
						<Link href="/privacy">{t({ es: 'Privacidad', en: 'Privacy' })}</Link>
						<Link href="/cookies">Cookies</Link>
					</nav>
					<p className={cx('credit')}>{t({ es: 'Hecho por', en: 'Made by' })} <a href="https://constantin.saguin.com" target="_blank">constantin.saguin</a></p>
				</div>
			</Container>
		</footer>
	);
}
