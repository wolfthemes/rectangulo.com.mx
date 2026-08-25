import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import styles from './AboutServices.module.scss';

let cx = classNames.bind(styles);

const SERVICES = [
	{ title: 'Photography', items: 'Campaigns · Portraits · Products · Events' },
	{ title: 'Equipment', items: 'Cameras · Lenses · Lighting · Grip · Audio' },
	{ title: 'Live & Streaming', items: 'Live Events · Multicam · Streaming · AV' },
	{ title: 'Production', items: 'Commercials · Branded Content · Films · Social' },
];

// ponytail: copy matches the current client site's About page. See the
// "About page: Next.js-first build" plan — real WP-sourced props come later.
export default function AboutServices() {
	return (
		<section className={cx('component')}>
			<Container>
				<div className={cx('quoteRow')}>
					<blockquote className={cx('quote')}>
						“We work as an extension of your team, from development to post-production; we
						ask, listen, and refine. The result? Tailor-made pieces with high impact, crafted
						to transcend.”
					</blockquote>
					<p className={cx('attribution')}>
						Rectángulo Producciones Audiovisuales.
						<br />
						GDL · CDMX · MTY.
					</p>
				</div>

				<Heading level="h2" className={cx(['heading', 'is-animated-heading'])}>
					How we can help
				</Heading>

				<ul className={cx('services')}>
					{SERVICES.map(({ title, items }) => (
						<li key={title} className={cx('service')}>
							<p className={cx('serviceTitle')}>{title}</p>
							<p className={cx('serviceItems')}>{items}</p>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
