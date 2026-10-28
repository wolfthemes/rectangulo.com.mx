import { useRef } from 'react';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import FondoInfinitoDiagram from './FondoInfinitoDiagram';
import { useT } from '../../lib/i18n';
import styles from './AboutInstalaciones.module.scss';

let cx = classNames.bind(styles);

// ponytail: copy/images match the current client site's About page. See the
// "About page: Next.js-first build" plan — real WP-sourced props come later.
export default function AboutInstalaciones() {
	const t = useT();

	// Pinned by FondoInfinitoDiagram for as long as it takes the diagram to
	// draw itself in — the sidebar below rides along, staying put and
	// vertically centered, since it's a sibling inside the same pinned box.
	const pinRef = useRef(null);

	return (
		<section className={cx('component')}>
			<div ref={pinRef} className={cx('scrollStage')}>
				<Container className={cx('scrollStageInner')}>
					<div className={cx('diagramCol')}>
						<FondoInfinitoDiagram pinRef={pinRef} />
						<Heading level="h3" className={cx('stageHeading')}>
							{t({ es: 'Foro 01 — Un espacio listo para cualquier proyecto.', en: 'Stage 01 — A space ready for any project.' })}
						</Heading>
						<p className={cx('amenities')}>
							{t({
								es: 'Aire acondicionado · Parrilla para iluminación · Baños · Área de maquillaje · Renta de equipo · Acceso independiente · Lounge para clientes.',
								en: 'Air conditioning · Lighting grid · Bathrooms · Makeup area · Equipment rental · Independent access · Client lounge.',
							})}
						</p>
					</div>

					<div className={cx('sidebar')}>
						<p className={cx('description')}>
							{t({
								es: 'Contamos con un foro para producciones audiovisuales de alto nivel. Un espacio versátil, equipado con iluminación profesional, ciclorama, áreas de montaje y un ambiente controlado que nos permite ejecutar proyectos con precisión, rapidez y calidad cinematográfica. Además, ponemos nuestras instalaciones y equipo audiovisual a disposición de productoras, marcas y creadores que buscan un espacio confiable y totalmente preparado para filmar.',
								en: 'We have a stage for high-end audiovisual productions. A versatile space equipped with professional lighting, a cyclorama, set-up areas and a controlled environment that lets us deliver projects with precision, speed and cinematic quality. We also make our facilities and audiovisual equipment available to production companies, brands and creators looking for a reliable space that is fully ready to shoot.',
							})}
						</p>
					</div>
				</Container>
			</div>
		</section>
	);
}
