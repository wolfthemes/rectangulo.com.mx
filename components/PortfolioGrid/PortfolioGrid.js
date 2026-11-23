import { useLayoutEffect } from 'react';
import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { WorkItemMedia } from '../WorkItemMedia';
import { revealOnEnter } from '../../lib/page-enter';
import { useT } from '../../lib/i18n';
import styles from './PortfolioGrid.module.scss';

let cx = classNames.bind(styles);

// ponytail: shown only once `works` has actually loaded and come back empty
// (see the `works === null` check below) — never as a flash before real
// posts arrive. Dossier's "Marcas que nos respaldan" slide.
const PLACEHOLDER_PROJECTS = [
	{
		title: 'Prospecto Zubba',
		excerpt: 'Presentar la nueva identidad visual de Zubba mediante una campaña que reforzara el lanzamiento del producto y modernizara la percepción de la marca.',
		year: 2025,
		image: '/images/stage-1/_1389483.jpg',
	},
	{
		title: 'Donas Rösk',
		excerpt: 'Generar una campaña digital que destacara la marca y diferenciara el producto dentro de su categoría.',
		year: 2024,
		image: '/images/stage-1/_1389486.jpg',
	},
	{
		title: 'Oh La Lashes',
		excerpt: 'Presentar el programa de membresía de la marca comunicando sus beneficios de forma clara y reforzando la percepción premium de la experiencia.',
		year: 2025,
		image: '/images/stage-1/_1389487.jpg',
	},
	{
		title: 'DAC Congress',
		excerpt: 'Realizamos una cobertura cinematográfica que integró conferencias, networking y momentos clave para generar contenido institucional y promocional de alto impacto.',
		year: 2025,
		image: '/images/stage-1/_1389489.jpg',
	},
];

// `works`: undefined/null while the query hasn't resolved yet, [] once it has
// and there's genuinely nothing published — only the latter falls back to
// placeholders, so real posts never get preceded by a placeholder flash.
export default function PortfolioGrid({ works }) {
	const t = useT();
	const projects = !works
		? null
		: works.length
			? works.map((work) => ({
					title: work.title,
					// WP excerpts come through as HTML (auto-generated <p>…</p>) — strip
					// tags rather than dangerouslySetInnerHTML for a one-line caption.
					excerpt: (work.excerpt ?? '').replace(/<[^>]+>/g, ''),
					year: work.workYear,
					href: `/work/${work.slug}`,
					work,
				}))
			: PLACEHOLDER_PROJECTS;

	// useLayoutEffect, not useEffect: the hidden state has to land before the
	// browser's first paint of these cards, or they flash visible for a frame.
	useLayoutEffect(() => {
		if (projects) revealOnEnter(`.${styles.card}`, { stagger: 0.08 });
	}, [projects]);

	return (
		<section className={cx('component')}>
			<Container>
				{projects && (
					<ul className={cx('grid')}>
						{projects.map(({ title, excerpt, year, image, href, work }) => {
							const card = (
								<>
									<div className={cx('image')}>
										{work ? (
											<WorkItemMedia work={work} />
										) : (
											<img className={cx('fallback')} src={image} alt={title} loading="lazy" />
										)}
									</div>
									<div className={cx('caption')}>
										<p className={cx('client')}>{t({ es: 'Cliente', en: 'Client' })}</p>
										<h3 className={cx('title')}>{title}</h3>
										<p className={cx('excerpt')}>{excerpt}</p>
										<p className={cx('year')}>{year}</p>
									</div>
								</>
							);

							return (
								<li key={title} className={cx('card')}>
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
