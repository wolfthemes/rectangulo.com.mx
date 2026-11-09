import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import { useT } from '../../lib/i18n';
import styles from './AboutHero.module.scss';

let cx = classNames.bind(styles);

// ponytail: copy matches the current client site's About page. Opening
// image is a real BTS still standing in for proper art direction until the
// client supplies one — same placeholder approach as HomeExplore's tiles.
// See the "About page: Next.js-first build" plan — real WP-sourced props
// come later.
export default function AboutHero() {
	const t = useT();

	return (
		<section className={`${cx('component')} grain`}>
			{/* Brief (ABOUT - Opening Image): large-format image as the main
			    visual element, full-bleed ahead of the Container below —
			    "No Geographic Limits" moves after it instead of sitting
			    beside the old small map graphic. */}
			<img
				className={cx('opener')}
				src={encodeURI('/images/BEHIND THE SCENES/GENERAL BTS/_0019094.jpg')}
				alt=""
				width={2000}
				height={1333}
			/>
			<Container>
				<Heading level="h1" className={cx(['heading', 'is-animated-chars'])}>
					{t({
							es: <>Sin límites<br />geográficos</>,
							en: <>No geographic<br />limits</>,
						})}
				</Heading>
				<p className={cx(['body', 'is-animated-lines'])}>
					{t({
							es: 'Nuestro trabajo ha trascendido fronteras y nos ha permitido contar historias en distintos territorios, consolidándonos como una productora con alcance nacional e internacional. Contamos con la capacidad operativa para gestionar proyectos simultáneos tanto en territorio nacional como en el extranjero. Hemos desarrollado producciones en países como Perú y Nicaragua, y estamos preparados para llevar nuestra visión cinematográfica a cualquier parte del mundo.',
							en: 'Our work has crossed borders and let us tell stories across different territories, establishing us as a production company with national and international reach. We have the operational capacity to manage simultaneous projects both in Mexico and abroad. We have produced in countries such as Peru and Nicaragua, and we are ready to bring our cinematic vision anywhere in the world.',
						})}
				</p>
			</Container>
		</section>
	);
}
