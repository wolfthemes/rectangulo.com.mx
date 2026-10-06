import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './ServicesCTA.module.scss';

let cx = classNames.bind(styles);

// Brief section 06 — contact/social/legal already live in Footer, rendered
// right after this (same split as HomeCTA on the HOME page).
export default function ServicesCTA() {
	return (
		<section className={cx('component')}>
			<Container>
				<h2 className={cx('heading')}>Let&rsquo;s Work Together</h2>
				<p className={cx('body')}>
					Short invitation to discuss a production, service or technical requirement.
				</p>
				<Link href="/contact" className={cx('link')}>
					Start a Project <span aria-hidden="true">→</span>
				</Link>
			</Container>
		</section>
	);
}
