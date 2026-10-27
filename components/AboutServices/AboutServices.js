import classNames from 'classnames/bind';
import { Container } from '../Container';
import { Heading } from '../Heading';
import { useT } from '../../lib/i18n';
import styles from './AboutServices.module.scss';

let cx = classNames.bind(styles);

const SERVICES = [
	{
		title: { es: 'Fotografía', en: 'Photography' },
		items: { es: 'Campañas · Retratos · Productos · Eventos', en: 'Campaigns · Portraits · Products · Events' },
	},
	{
		title: { es: 'Equipo', en: 'Equipment' },
		items: { es: 'Cámaras · Lentes · Iluminación · Grip · Audio', en: 'Cameras · Lenses · Lighting · Grip · Audio' },
	},
	{
		title: { es: 'En vivo y streaming', en: 'Live & Streaming' },
		items: { es: 'Eventos en vivo · Multicámara · Streaming · AV', en: 'Live Events · Multicam · Streaming · AV' },
	},
	{
		title: { es: 'Producción', en: 'Production' },
		items: { es: 'Comerciales · Branded content · Cine · Redes', en: 'Commercials · Branded Content · Films · Social' },
	},
];

// ponytail: copy matches the current client site's About page. See the
// "About page: Next.js-first build" plan — real WP-sourced props come later.
export default function AboutServices() {
	const t = useT();

	return (
		<section className={`${cx('component')} grain`}>
			<Container>
				<div className={cx('quoteRow')}>
					<blockquote className={cx('quote')}>
						{t({
							es: '“Trabajamos como una extensión de tu equipo, desde el desarrollo hasta la postproducción; preguntamos, escuchamos y afinamos. ¿El resultado? Piezas a la medida, de alto impacto, creadas para trascender.”',
							en: '“We work as an extension of your team, from development to post-production; we ask, listen, and refine. The result? Tailor-made pieces with high impact, crafted to transcend.”',
						})}
					</blockquote>
					<p className={cx('attribution')}>
						Rectángulo Producciones Audiovisuales.
						<br />
						GDL · CDMX · MTY.
					</p>
				</div>

				<Heading level="h2" className={cx(['heading', 'is-animated-heading'])}>
					{t({ es: 'Cómo podemos ayudarte', en: 'How we can help' })}
				</Heading>

				<ul className={cx('services')}>
					{SERVICES.map(({ title, items }) => (
						<li key={title.en} className={cx('service')}>
							<p className={cx('serviceTitle')}>{t(title)}</p>
							<p className={cx('serviceItems')}>{t(items)}</p>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
