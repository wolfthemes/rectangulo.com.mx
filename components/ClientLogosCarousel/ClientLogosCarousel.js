import classNames from 'classnames/bind';
import styles from './ClientLogosCarousel.module.scss';

let cx = classNames.bind(styles);

// ponytail: logos are hardcoded from public/images/client-logos rather than
// read dynamically (that needs a server-side fs call this client component
// can't make). Standalone piece for now — swap for a WP-driven `logos` prop
// once the custom Gutenberg block for this exists.
const LOGOS = [
	{ file: 'odella-rgs1we3d9rc1l08hvoxw6g7t4hdm8c5hy237a5a77k.webp', alt: 'Odellā' },
	{ file: 'La-perla-rgs1wr93xfu23jpdqumo5cw9fvkr83lqnv8000qosg.webp', alt: 'La Perla' },
	{ file: 'galenum-rgs1x4eul4c2m369m0bg49kpr9rw7v1zdocspw76dc.webp', alt: 'Galenum' },
	{
		file: 'Feellers-Wheel-Center-rgs1xgmr1ysst0oimnlliohpha3nzxehrcu3yhp24g.webp',
		alt: 'Feellers Wheel Center',
	},
	{ file: 'Encore-rgs1xsunit9izy6rnavqx3ep7affrzr051bf736xvk.webp', alt: 'Encore' },
	{ file: 'dermaheilen-rgs1y60e6hrjihnnigkiw035iomkrr78uug7wynfgg.webp', alt: 'DermaHeilen' },
	{ file: 'DAC-rgs1yj64u69k114jdm9auwrlu2tprinhknl0mu3x1c.webp', alt: 'DAC' },
	{ file: 'Celion-rgs1ywbvhurkjklf8ry2ttg25h0ura3qagptcpkem8.webp', alt: 'Celion' },
	{
		file: 'casa-ideas-rgs1z9hm5j9l242b3xmusq4igv7zr1jz09um2l0w74.webp',
		alt: 'Casa Ideas',
	},
	{
		file: 'Adian-Canelon-rgs1zmnct7rlknj6z3bmrmsys9f4qt07q2zesghds0.webp',
		alt: 'Adrian Canelon',
	},
	{
		file: 'Ramses-soriano-rgs1vnrvyec0jxaq5dkc8muwhozc8t90iftlued81s.webp',
		alt: 'Ramses Soriano',
	},
	{ file: 'rosk-rgs1vbjzhjvaczsh4qa6u7xwronkgqwi4rcalsvcao.webp', alt: 'Rosk' },
	{
		file: 'Simetria-Academy-rgs1um6cd0wjnitc8xb9gwcgqa4nox3r19q6nbwyyo.webp',
		alt: 'Simetria Academy',
	},
	{ file: 'Uniat-rgs1uzc30pek62a84301ft0x1obsoojzr2uzd7dgjk.webp', alt: 'Uniat' },
];

function Track() {
	return (
		<div className={cx('track')} aria-hidden={true}>
			{LOGOS.map(({ file, alt }) => (
				<img
					key={file}
					className={cx('logo')}
					src={`/images/client-logos/${file}`}
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
