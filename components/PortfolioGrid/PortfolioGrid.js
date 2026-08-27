import { useEffect } from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { observeItemsInView } from '../../lib/animate-headings';
import styles from './PortfolioGrid.module.scss';

let cx = classNames.bind(styles);

// ponytail: shown only once `works` has actually loaded and come back empty
// (see the `works === null` check below) — never as a flash before real
// posts arrive. Dossier's "Marcas que nos respaldan" slide, hand-picked
// caption color per item.
const PLACEHOLDER_PROJECTS = [
	{
		title: 'Prospecto Zubba',
		excerpt: 'Presentar la nueva identidad visual de Zubba mediante una campaña que reforzara el lanzamiento del producto y modernizara la percepción de la marca.',
		year: 2025,
		image: '/images/stage-1/_1389483.jpg',
		color: '#3a1140',
	},
	{
		title: 'Donas Rösk',
		excerpt: 'Generar una campaña digital que destacara la marca y diferenciara el producto dentro de su categoría.',
		year: 2024,
		image: '/images/stage-1/_1389486.jpg',
		color: '#7a2020',
	},
	{
		title: 'Oh La Lashes',
		excerpt: 'Presentar el programa de membresía de la marca comunicando sus beneficios de forma clara y reforzando la percepción premium de la experiencia.',
		year: 2025,
		image: '/images/stage-1/_1389487.jpg',
		color: '#3c4a1f',
	},
	{
		title: 'DAC Congress',
		excerpt: 'Realizamos una cobertura cinematográfica que integró conferencias, networking y momentos clave para generar contenido institucional y promocional de alto impacto.',
		year: 2025,
		image: '/images/stage-1/_1389489.jpg',
		color: '#12233f',
	},
];

// Deterministic stand-in for real dominant-color extraction (no color meta
// field on the CPT — see the theme's register-work-fields.php). Swap for an
// actual sampler (e.g. a `node-vibrant`/`sharp` build step over
// featuredImage) once that's worth building.
const FALLBACK_COLORS = ['#3a1140', '#7a2020', '#3c4a1f', '#12233f', '#5c3a10', '#1f2a3c'];

function colorFor(slug) {
	let hash = 0;
	for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
	return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

// `works`: undefined/null while the query hasn't resolved yet, [] once it has
// and there's genuinely nothing published — only the latter falls back to
// placeholders, so real posts never get preceded by a placeholder flash.
export default function PortfolioGrid({ works }) {
	const projects = !works
		? null
		: works.length
			? works.map(({ title, excerpt, workYear, slug, featuredImage }) => ({
					title,
					// WP excerpts come through as HTML (auto-generated <p>…</p>) — strip
					// tags rather than dangerouslySetInnerHTML for a one-line caption.
					excerpt: (excerpt ?? '').replace(/<[^>]+>/g, ''),
					year: workYear,
					image: featuredImage?.node?.sourceUrl,
					color: colorFor(slug),
					href: `/work/${slug}`,
				}))
			: PLACEHOLDER_PROJECTS;

	useEffect(() => {
		if (projects) observeItemsInView(`.${styles.card}`);
	}, [projects]);

	return (
		<section className={cx('component')}>
			<Container>
				{projects && (
					<ul className={cx('grid')}>
						{projects.map(({ title, excerpt, year, image, color, href }, index) => {
							const card = (
								<>
									<img className={cx('image')} src={image} alt={title} loading="lazy" />
									<div className={cx('caption')} style={{ backgroundColor: color }}>
										<p className={cx('client')}>Client</p>
										<h3 className={cx('title')}>{title}</h3>
										<p className={cx('excerpt')}>{excerpt}</p>
										<p className={cx('year')}>{year}</p>
									</div>
								</>
							);

							return (
								<li
									key={title}
									className={cx(['card', 'is-animated-item'])}
									style={{ '--item-index': index }}
								>
									{href ? (
										<Link href={href} className={cx('link')}>
											{card}
										</Link>
									) : (
										card
									)}
								</li>
							);
						})}
					</ul>
				)}
			</Container>
		</section>
	);
}
