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

export default function HomeExplore() {
	return (
		<section className={cx('component')}>
			<Container>
				<ul className={cx('list')}>
					{PATHS.map(({ label, href, description }) => (
						<li key={label} className={cx('item')}>
							<Link href={href} className={cx('link')}>
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
