import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { useT } from '../../lib/i18n';
import styles from './HomeCTA.module.scss';

let cx = classNames.bind(styles);

// Brief section 08, the CTA half only — contact/social/legal already live
// in Footer, rendered right after this.
export default function HomeCTA() {
	const t = useT();

	return (
		<section className={cx('component')}>
			<Container>
				<Link href="/contact" className={cx('link')}>
					{t({ es: <>Colaboremos</>, en: <>Let&rsquo;s<br />Collaborate</> })}
				</Link>
			</Container>
		</section>
	);
}
