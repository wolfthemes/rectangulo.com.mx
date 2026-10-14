import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import { CONTACT_EMAIL, CONTACT_PHONE, WEBSITE } from '../../constants/contact';
import styles from './ContactHero.module.scss';

let cx = classNames.bind(styles);


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
