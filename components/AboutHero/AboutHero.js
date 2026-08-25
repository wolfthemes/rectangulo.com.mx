import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import styles from './AboutHero.module.scss';

let cx = classNames.bind(styles);

// ponytail: copy matches the current client site's About page; image-1.webp
// is the actual map graphic from that page. See the "About page:
// Next.js-first build" plan — real WP-sourced props come later.
export default function AboutHero() {
	return (
		<section className={cx('component')}>
			<Container>
				<div className={cx('top')}>
					<img
						className={cx('map')}
						src="/images/image-1.webp"
						alt="Mapa de México, Perú y Nicaragua"
						width={1600}
						height={2048}
					/>
					<Heading level="h1" className={cx(['heading', 'is-animated-heading'])}>
						Sin límites
						<br />
						geográficos
					</Heading>
					<img
						className={cx('rightImage')}
						src="/images/Captura-de-pantalla-2025-12-23-200136-1024x283.webp"
						alt=""
					/>
				</div>
				<p className={cx(['body', 'is-animated-heading'])}>
					Nuestro trabajo ha trascendido fronteras y nos ha permitido contar historias en
					distintos territorios, consolidándonos como una productora con alcance nacional e
					internacional. Contamos con la capacidad operativa para gestionar proyectos
					simultáneos tanto en territorio nacional como en el extranjero. Hemos desarrollado
					producciones en países como Perú y Nicaragua, y estamos preparados para llevar
					nuestra visión cinematográfica a cualquier parte del mundo.
				</p>
			</Container>
		</section>
	);
}
