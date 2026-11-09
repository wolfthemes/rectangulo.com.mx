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
		<section className={`${cx('component')} grain`}>
			<Container>
				{/* Brief (GENERAL - Typography Design): the logo's elongated-
				    stroke "E" carried into one featured heading, not every E on
				    the page — a plain stretched span, not a font-ligature trick,
				    so the word still reads correctly if the display font fails
				    to load. */}
				{/* Contact merged into Footer (brief: FOOTER - Contact Integration) —
				no standalone /contact page to link to anymore. */}
				<Link href="#contact" className={cx('link')}>
					{t({
						es: <>Colabor<span className={cx('flourish')}>e</span>mos</>,
						en: <>Let&rsquo;s<br />Collaborat<span className={cx('flourish')}>e</span></>,
					})}
				</Link>
			</Container>
		</section>
	);
}
