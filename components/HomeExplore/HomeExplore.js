import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import { useT } from '../../lib/i18n';
import styles from './HomeExplore.module.scss';

let cx = classNames.bind(styles);

// Brief section 04: oversized links as the primary content-area nav.
// Images: real BTS stills (not fabricated stock) standing in for proper art
// direction per section until the client provides that.
const PATHS = [
	{
		label: { es: 'Servicios', en: 'Services' },
		href: '/services',
		description: { es: 'Capacidades disponibles para nuestros clientes.', en: 'Capabilities available to clients.' },
		image: '/images/BEHIND THE SCENES/GENERAL BTS/_MG_2036.jpg',
	},
	{
		label: { es: 'Proyectos', en: 'Projects' },
		href: '/projects',
		description: { es: 'Proyectos realizados para clientes y colaboraciones.', en: 'Completed client and collaboration work.' },
		image: '/images/BEHIND THE SCENES/GENERAL BTS/_0010042.jpg',
	},
];

// Marquee strip under each item's hover state: the label repeated, rendered
// twice in a row so a CSS translateX(-50%) loop can wrap seamlessly (the
// second copy lands exactly where the first started).
function marqueeText(label) {
	return `${label.toUpperCase()} • `.repeat(6);
}

export default function HomeExplore() {
	const t = useT();

	return (
		<section className={`${cx('component')} grain`}>
			<ul className={cx('list')}>
				{PATHS.map(({ label: labelCopy, href, description: descriptionCopy, image }) => {
					const label = t(labelCopy);
					const description = t(descriptionCopy);
					return (
					<li key={href} className={cx('item')}>
						<Link href={href} className={cx('link')}>
							<span className={cx('bg')} aria-hidden="true">
								<Image
									src={encodeURI(image)}
									alt=""
									fill
									sizes="100vw"
									className={cx('bgImage')}
								/>
								<span className={cx('bgGradient')} />
							</span>
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
					);
				})}
			</ul>
		</section>
	);
}
