import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './HomeExplore.module.scss';

let cx = classNames.bind(styles);

// Brief section 04: three oversized links as the primary content-area nav —
// PROJECTS has no CPT on the backend yet (only `work`/`video`), so it links
// out as a plain page for now; swap once that content type exists.
const PATHS = [
	{ label: 'Work', href: '/portfolio', description: 'Completed client and collaboration work.' },
	{ label: 'Services', href: '/services', description: 'Capabilities available to clients.' },
	{ label: 'Projects', href: '/projects', description: 'Original IP — series, films and Aahh! La Brava.' },
];

// Marquee strip under each item's hover state: the label repeated, rendered
// twice in a row so a CSS translateX(-50%) loop can wrap seamlessly (the
// second copy lands exactly where the first started).
function marqueeText(label) {
	return `${label.toUpperCase()} • `.repeat(6);
}

export default function HomeExplore() {
	return (
		<section className={`${cx('component')} grain`}>
			<Container>
				<ul className={cx('list')}>
					{PATHS.map(({ label, href, description }, i) => (
						<li key={label} className={cx('item')}>
							<Link href={href} className={cx('link')}>
								{/* ponytail: no art direction/photography for these three yet —
								    a flat tint stands in for a real background image, swap the
								    background-image in once stills exist per section. */}
								<span className={cx('bg', `bg--${i % 3}`)} aria-hidden="true" />
								<span className={cx('marquee')} aria-hidden="true">
									<span className={cx('marqueeTrack')}>
										<span>{marqueeText(label)}</span>
										<span>{marqueeText(label)}</span>
									</span>
								</span>
								<span className={cx('label')}>{label}</span>
								<span className={cx('description')}>{description}</span>
							</Link>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
