import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './AboutTeam.module.scss';

let cx = classNames.bind(styles);

const SOCIAL_LINKS = [
	{ label: 'Instagram', href: 'https://instagram.com/rectangulo' },
	{ label: 'YouTube', href: 'https://youtube.com/@rectangulo' },
	{ label: 'LinkedIn', href: 'https://linkedin.com/company/rectangulo' },
];

const TEAM = [
	{ name: 'Roman Alejandro', role: 'Producer', email: 'r.martinez@rectangulo.com.mx' },
	{ name: 'Josh Sándre', role: 'Director / Producer', email: 'josh.sandre@rectangulo.com.mx' },
];

// ponytail: copy matches the current client site's About page. See the
// "About page: Next.js-first build" plan — real WP-sourced props come later.
export default function AboutTeam() {
	return (
		<section className={cx('component')}>
			<Container>
				<div className={cx('grid')}>
					<div className={cx('column')}>
						{SOCIAL_LINKS.map(({ label, href }) => (
							<a key={label} className={cx('link')} href={href} target="_blank" rel="noreferrer">
								{label}
							</a>
						))}
					</div>

					<div className={cx('column')}>
						<p className={cx('heading')}>Team</p>
						{TEAM.map(({ name, role, email }) => (
							<div key={name} className={cx('member')}>
								<p className={cx('memberName')}>{name}</p>
								<p className={cx('memberRole')}>{role}</p>
								<a className={cx('link')} href={`mailto:${email}`}>
									{email}
								</a>
							</div>
						))}
					</div>

					<div className={cx('column')}>
						<p className={cx('heading')}>Contact</p>
						<p className={cx('cta')}>Let&rsquo;s create something unforgettable together.</p>
						<a className={cx('link')} href="mailto:contacto@rectangulo.com.mx">
							contacto@rectangulo.com.mx
						</a>
					</div>
				</div>
			</Container>
		</section>
	);
}
