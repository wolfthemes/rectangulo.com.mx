import classNames from 'classnames/bind';
import { useScrollZoom } from '../../lib/useScrollZoom';
import styles from './ParallaxSection.module.scss';

let cx = classNames.bind(styles);

// The one section raw WP block HTML could never do: a scroll-linked
// parallax + zoom on the image. Image is a hardcoded placeholder for now —
// see the "About page: Next.js-first build" plan.
export default function ParallaxSection() {
	const { sectionRef, imageRef } = useScrollZoom();

	return (
		<section ref={sectionRef} className={cx('component')}>
			<img
				ref={imageRef}
				className={cx('image')}
				src="/images/foro.webp"
				alt="Foro de grabación, fondo infinito de 192 m³"
				loading="lazy"
			/>
		</section>
	);
}
