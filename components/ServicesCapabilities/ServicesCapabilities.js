import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { useT } from '../../lib/i18n';
import styles from './ServicesCapabilities.module.scss';

let cx = classNames.bind(styles);

// ponytail: brief section 03 — one service per viewport-sized panel; each
// next panel slides up over the previous one (curtain/card stack) via pure
// CSS `position: sticky`, no JS. Swap each `.loop` placeholder for a real
// autoplay clip once footage exists. Stack is desktop-only (>= medium);
// mobile stays a plain list so tall content never clips.
const SERVICES = [
	{
		number: '03.1',
		title: { es: 'Preproducción', en: 'Pre-production' },
		description: {
			es: 'Desarrollo de cada proyecto desde la idea inicial hasta un plan de producción creativo, técnico y ejecutable.',
			en: 'Development of each project from the initial idea into a creative, technical and executable production plan.',
		},
		capabilities: {
			es: [
				'Desarrollo creativo', 'Tratamiento creativo', 'Desarrollo de concepto', 'Investigación',
				'Desarrollo de guion', 'Storyboards', 'Moodboards', 'Previsualización',
				'Planeación de producción', 'Presupuestos', 'Calendarización', 'Casting',
				'Búsqueda de locaciones', 'Planeación de equipo', 'Planeación técnica',
			],
			en: [
				'Creative Development', 'Creative Treatment', 'Concept Development', 'Research',
				'Script Development', 'Storyboards', 'Moodboards', 'Previsualization',
				'Production Planning', 'Budgeting', 'Scheduling', 'Casting',
				'Location Scouting', 'Crew Planning', 'Technical Planning',
			],
		},
	},
	{
		number: '03.2',
		title: { es: 'Producción', en: 'Production' },
		description: {
			es: 'Producción audiovisual integral, desde equipos compactos hasta producciones de mayor escala.',
			en: 'End-to-end audiovisual production, from compact crews to larger-scale productions.',
		},
		capabilities: {
			es: [
				'Comerciales', 'Publicidad', 'Branded content', 'Videoclips', 'Contenido digital',
				'Contenido corporativo', 'Cine', 'Series', 'Documental', 'Entrevistas',
				'Videos de producto', 'Contenido para redes', 'Producción multicámara',
			],
			en: [
				'Commercials', 'Advertising', 'Branded Content', 'Music Videos', 'Digital Content',
				'Corporate Content', 'Films', 'Series', 'Documentary', 'Interviews',
				'Product Films', 'Social Content', 'Multi-camera Production',
			],
		},
	},
	{
		number: '03.3',
		title: { es: 'Postproducción', en: 'Post-production' },
		description: {
			es: 'Flujos de postproducción que llevan el material desde la edición hasta la masterización y entrega final.',
			en: 'Post-production workflows that take material from the edit through final mastering and delivery.',
		},
		capabilities: {
			es: [
				'Edición', 'Edición offline / online', 'Corrección de color', 'Etalonaje',
				'Edición de sonido', 'Diseño sonoro', 'Mezcla', 'Motion graphics', 'Títulos',
				'Gráficos', 'Masterización', 'Entregables / adaptaciones',
			],
			en: [
				'Editing', 'Offline / Online Editing', 'Color Correction', 'Color Grading',
				'Sound Editing', 'Sound Design', 'Mixing', 'Motion Graphics', 'Titles',
				'Graphics', 'Mastering', 'Deliverables / Adaptations',
			],
		},
	},
	{
		number: '03.4',
		title: { es: 'Eventos y producción en vivo', en: 'Events & Live Production' },
		description: {
			es: 'Diseño audiovisual, producción y operación técnica para eventos, congresos, activaciones y experiencias en vivo.',
			en: 'Audiovisual design, production and technical operation for events, congresses, activations and live experiences.',
		},
		capabilities: {
			es: [
				'Producción de eventos', 'Eventos masivos', 'Transmisión en vivo', 'CCTV', 'Producción multicámara',
				'Sistemas PTZ', 'Pantallas LED', 'Pantallas LED gigantes', 'Diseño de escenario', 'Contenido visual',
				'Contenido para shows', 'Dirección técnica', 'Foto y video de eventos', 'Activaciones de marca',
				'Stands', 'Resúmenes de eventos',
			],
			en: [
				'Event Production', 'Mass Events', 'Live Streaming', 'CCTV', 'Multi-camera Production',
				'PTZ Systems', 'LED Screens', 'Giant LED Displays', 'Stage Design', 'Visual Content',
				'Show Content', 'Technical Direction', 'Event Photo & Video', 'Brand Activations',
				'Stands / Booths', 'Event Recaps',
			],
		},
	},
	{
		number: '03.5',
		title: { es: 'Fotografía', en: 'Photography' },
		description: {
			es: 'Producción fotográfica para campañas, marcas, productos, personas y contenido editorial.',
			en: 'Photography production for campaigns, brands, products, people and editorial content.',
		},
		capabilities: {
			es: [
				'Publicidad', 'Campañas', 'Producto', 'Gastronomía', 'Moda', 'Retrato', 'Corporativa',
				'Lifestyle', 'Documental', 'Fotografía de eventos', 'Editorial', 'Behind the scenes',
				'Foto fija de producción',
			],
			en: [
				'Advertising', 'Campaigns', 'Product', 'Food', 'Fashion', 'Portrait', 'Corporate',
				'Lifestyle', 'Documentary', 'Event Photography', 'Editorial', 'Behind the Scenes',
				'Production Stills',
			],
		},
	},
	{
		number: '03.6',
		title: { es: 'Renta de equipo', en: 'Equipment Rental' },
		description: {
			es: 'Equipo audiovisual profesional disponible en renta individual o integrado a una producción de Rectángulo.',
			en: 'Professional audiovisual equipment available as individual rentals or integrated into a Rectángulo production.',
		},
		capabilities: {
			es: [
				'Cámaras', 'Cámaras de cine', 'Lentes / óptica', 'Iluminación', 'Video inalámbrico',
				'Monitores', 'Soporte de cámara', 'Tripiés', 'Gimbals', 'Audio',
				'Accesorios de producción', 'Sistemas de video',
			],
			en: [
				'Cameras', 'Cinema Cameras', 'Lenses / Optics', 'Lighting', 'Wireless Video',
				'Monitors', 'Camera Support', 'Tripods', 'Gimbals', 'Audio',
				'Production Accessories', 'Video Systems',
			],
		},
		cta: { label: { es: 'Ver equipo en renta →', en: 'View Rental Equipment →' }, href: '/rental' },
	},
];

export default function ServicesCapabilities() {
	const t = useT();

	return (
		<section className={cx('component')}>
			{SERVICES.map(({ number, title, description, capabilities, cta }) => (
				<article key={number} className={cx('service')}>
					<Container>
						<div className={cx('inner')}>
							<div className={cx('loop')} aria-hidden="true" />
							<div className={cx('info')}>
								<span className={cx('number')}>{number}</span>
								<h3 className={cx('title')}>{t(title)}</h3>
								<p className={cx('description')}>{t(description)}</p>
								<p className={cx('capabilities')}>{t(capabilities).join(' · ')}</p>
								{cta && <Link href={cta.href} className={cx('cta')}>{t(cta.label)}</Link>}
							</div>
						</div>
					</Container>
				</article>
			))}
		</section>
	);
}
