import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import styles from './AboutInstalaciones.module.scss';

let cx = classNames.bind(styles);

// ponytail: copy/images match the current client site's About page. See the
// "About page: Next.js-first build" plan — real WP-sourced props come later.
export default function AboutInstalaciones() {
	return (
		<section className={cx('component')}>
			<Container>
				<Heading level="h2" className={cx(['heading', 'is-animated-heading'])}>
					Instalaciones
				</Heading>

				<div className={cx('columns')}>
					<div className={cx('column')}>
						<img
							className={cx('diagram')}
							src="/images/Asset-1.webp"
							alt="Diagrama del foro: 8m x 6m, 4m de altura, fondo infinito de 192 m³"
						/>
						<Heading level="h3" className={cx('stageHeading')}>
							Stage 01 — A space ready for any project.
						</Heading>
						<p className={cx('amenities')}>
							Aire acondicionado · Parrilla para iluminación · Baños · Área de maquillaje ·
							Renta de equipo · Acceso independiente · Lounge para clientes.
						</p>
					</div>

					<div className={cx('column')}>
						<p className={cx('description')}>
							Contamos con un foro para producciones audiovisuales de alto nivel. Un espacio
							versátil, equipado con iluminación profesional, ciclorama, áreas de montaje y un
							ambiente controlado que nos permite ejecutar proyectos con precisión, rapidez y
							calidad cinematográfica. Además, ponemos nuestras instalaciones y equipo
							audiovisual a disposición de productoras, marcas y creadores que buscan un
							espacio confiable y totalmente preparado para filmar.
						</p>
					</div>
				</div>
			</Container>
		</section>
	);
}
