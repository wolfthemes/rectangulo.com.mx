import classNames from 'classnames/bind';
import styles from './ClientLogosCarousel.module.scss';

let cx = classNames.bind(styles);

// ponytail: logos are hardcoded from public/images/client-logos rather than
// read dynamically (that needs a server-side fs call this client component
// can't make). Standalone piece for now — swap for a WP-driven `logos` prop
// once the custom Gutenberg block for this exists.
const LOGOS = [
	{ file: 'odella.png', alt: 'Odellā' },
	{ file: 'La perla.png', alt: 'La Perla' },
	{ file: 'galenum.png', alt: 'Galenum' },
	{ file: 'Feellers Wheel Center.png', alt: 'Feellers Wheel Center' },
	{ file: 'Encore.png', alt: 'Encore' },
	{ file: 'dermaheilen.png', alt: 'DermaHeilen' },
	{ file: 'DAC.png', alt: 'DAC' },
	{ file: 'Celion.png', alt: 'Celion' },
	{ file: 'casa ideas.png', alt: 'Casa Ideas' },
	{ file: 'Adian Canelon.png', alt: 'Adrian Canelon' },
	{ file: 'Ramses soriano.png', alt: 'Ramses Soriano' },
	{ file: 'rosk.png', alt: 'Rosk' },
	{ file: 'Simetria Academy.png', alt: 'Simetria Academy' },
	{ file: 'Uniat.png', alt: 'Uniat' },
	{ file: 'Ohlalashes.png', alt: 'Ohlalashes' },
];

function Track() {
	return (
		<div className={cx('track')} aria-hidden={true}>
			{LOGOS.map(({ file, alt }) => (
				<img
					key={file}
					className={cx('logo')}
					src={`/images/client-logos/${encodeURIComponent(file)}`}
					alt={alt}
					loading="lazy"
				/>
			))}
		</div>
	);
}

export default function ClientLogosCarousel({ className }) {
	return (
		<div className={cx(['component', className])} role="list" aria-label="Clientes">
			{/* Track rendered twice back-to-back for a seamless CSS marquee loop. */}
			<Track />
			<Track />
		</div>
	);
}
