import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './ServicesCTA.module.scss';

let cx = classNames.bind(styles);

// Brief section 06 — contact/social/legal already live in Footer, rendered
// right after this (same split as HomeCTA on the HOME page). Props let the
// WORK page (brief p.10) reuse it with its own wording.
export default function ServicesCTA({
	heading = 'Let\u2019s Work Together',
	body = 'Short invitation to discuss a production, service or technical requirement.',
	label = 'Start a Project',
}) {
	return (
		<section className={cx('component')}>
			<Container>
				<h2 className={cx('heading')}>{heading}</h2>
				<p className={cx('body')}>{body}</p>
				<Link href="/contact" className={cx('link')}>
					{label} <span aria-hidden="true">→</span>
				</Link>
			</Container>
		</section>
	);
}
