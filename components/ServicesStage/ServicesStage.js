import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './ServicesStage.module.scss';

let cx = classNames.bind(styles);

const FEATURES = [
	'Infinity Cyclorama', 'Lighting Grid', 'RGB LED Lighting', 'Air Conditioning',
	'Makeup Area', 'Dressing Rooms', 'Bathrooms', 'Equipment Rental',
	'Independent Access', 'Vehicle Access', 'Client Lounge',
];

// ponytail: brief section 04 — a floor-plan line-art that reveals dimensions
// and finally real studio photography as the user scrolls. No studio photos
// or a dedicated Offscreen Studio page exist yet, so this scaffold is the
// static end-state content only (specs + features); the scroll reveal and
// photo/video swap are a follow-up, and "Explore Offscreen Studio" stays
// text instead of a dead link until that page exists.
export default function ServicesStage() {
	return (
		<section className={cx('component')}>
			<Container>
				<div className={cx('layout')}>
					<div className={cx('plan')} aria-hidden="true">
						<span className={cx('dim', 'dim--width')}>8m</span>
						<span className={cx('dim', 'dim--depth')}>6m</span>
						<span className={cx('dim', 'dim--height')}>4m</span>
						<span className={cx('volume')}>
							192<sup>3</sup>
							<br />M
						</span>
					</div>

					<div className={cx('info')}>
						<h2 className={cx('heading')}>Stage 01 — a space ready for any project.</h2>
						<p className={cx('specs')}>192 m³ · 8 m × 6 m × 4 m</p>
						<p className={cx('features')}>{FEATURES.join(' · ')}</p>
						<span className={cx('link')}>Explore Offscreen Studio →</span>
					</div>
				</div>
			</Container>
		</section>
	);
}
