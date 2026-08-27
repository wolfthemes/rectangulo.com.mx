import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import styles from './ContactHero.module.scss';

let cx = classNames.bind(styles);

// ponytail: contact details match the "Trabajemos Juntos" dossier slide.
// Footer.js hardcodes a slightly different email (contacto@rectangulo.com.mx
// vs contacto@rectangulofilms.com here) — same "no WP field yet" situation,
// left alone since reconciling which is correct wasn't asked for.
const CONTACT_EMAIL = 'contacto@rectangulofilms.com';
const CONTACT_PHONE = '+52 3323881333';
const WEBSITE = 'rectangulo.com.mx';

export default function ContactHero() {
	return (
		<section className={cx('component')}>
			<div className={cx('band')}>
				<Container>
					<Heading level="h1" className={cx('heading')}>
						Trabajemos
						<br />
						juntos
					</Heading>
					{/* Wordmark, doubled letters per the StretchPro brand trick. */}
					<p className={cx('wordmark')}>Reectanguloo</p>
				</Container>
			</div>
			<Container>
				<div className={cx('details')}>
					<div className={cx('detail')}>
						<p className={`${cx('label')} u-secondary-text`}>Email</p>
						<a className={cx('value')} href={`mailto:${CONTACT_EMAIL}`}>
							{CONTACT_EMAIL}
						</a>
					</div>
					<div className={cx('detail')}>
						<p className={`${cx('label')} u-secondary-text`}>Phone Number</p>
						<a className={cx('value')} href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}>
							{CONTACT_PHONE}
						</a>
					</div>
					<div className={cx('detail')}>
						<p className={`${cx('label')} u-secondary-text`}>Website</p>
						<a className={cx('value')} href={`https://${WEBSITE}`}>
							{WEBSITE}
						</a>
					</div>
				</div>
			</Container>
		</section>
	);
}
