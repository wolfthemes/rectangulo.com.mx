import classNames from 'classnames/bind';
import { useScrollZoom } from '../../lib/useScrollZoom';
import styles from './AboutGallery.module.scss';

let cx = classNames.bind(styles);

// ponytail: single placeholder photo — see the "About page: Next.js-first
// build" plan. Swap/extend once real gallery images are available.
export default function AboutGallery() {
	const { sectionRef, imageRef } = useScrollZoom({ translateRange: 0, scaleRange: 0.15 });

	return (
		<section ref={sectionRef} className={cx('component')}>
			<img
				ref={imageRef}
				className={cx('image')}
				src="/images/417120800_24506019845680109_7295605237070055748_n-2000x1123.webp"
				alt="Equipo de Rectángulo en set de grabación"
				loading="lazy"
			/>
		</section>
	);
}
