import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { ProjectViewer } from '../ProjectViewer';
import { WorkItemMedia } from '../WorkItemMedia';
import styles from './HomeFeaturedWork.module.scss';

let cx = classNames.bind(styles);

// Matches $breakpoint-medium — same desktop-only, mouse-only gate pattern as
// WorkFilmstrip's PIN_QUERY: below this, or on touch, the preview stays
// static (no cursor to follow, and it'd just drift on scroll otherwise).
const FOLLOW_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

// Brief section 05/06: a curated, numbered selection (not the full archive —
// that's /portfolio) with a hover preview; a click opens the ProjectViewer
// overlay in place (the link href is only the new-tab / no-JS fallback).
export default function HomeFeaturedWork({ works }) {
	const [activeIndex, setActiveIndex] = useState(null);
	const [viewing, setViewing] = useState(null);
	const layoutRef = useRef(null);
	const previewRef = useRef(null);

	useEffect(() => {
		const layout = layoutRef.current;
		if (!layout) return undefined;

		const mq = window.matchMedia(FOLLOW_QUERY);
		const onMove = (e) => {
			if (!mq.matches || !previewRef.current) return;
			// Offset so the preview sits beside the cursor, not under it.
			previewRef.current.style.transform = `translate3d(${e.clientX + 32}px, ${e.clientY - 120}px, 0)`;
		};

		layout.addEventListener('mousemove', onMove);
		return () => layout.removeEventListener('mousemove', onMove);
	}, []);

	if (!works?.length) return null;

	const active = activeIndex != null ? works[activeIndex] : null;

	return (
		<section className={cx('component')}>
			<Container>
				<h2 className={cx('heading')}>
					Featured<br />Work
				</h2>

				<div ref={layoutRef} className={cx('layout')}>
					<ol className={cx('list')}>
						{works.map((work, i) => {
							const category = work.workTypes?.nodes?.[0]?.name;
							return (
								<li key={work.slug} className={cx('item')}>
									<Link
										href={`/work/${work.slug}`}
										className={cx('link')}
										data-no-transition
										onClick={(e) => {
											// Plain click opens the in-place viewer; modified clicks keep the
											// normal link behaviour (new tab, etc.). data-no-transition keeps
											// PageTransition's capture-phase interceptor out of the way.
											if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
											e.preventDefault();
											setViewing(work);
										}}
										onMouseEnter={() => setActiveIndex(i)}
										onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
										onFocus={() => setActiveIndex(i)}
										onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
									>
										<span className={cx('index')}>{String(i + 1).padStart(2, '0')}</span>
										<span className={cx('title')}>{work.title}</span>
										{category && <span className={cx('category')}>{category}</span>}
									</Link>
								</li>
							);
						})}
					</ol>

					<div
					ref={previewRef}
					className={cx('preview', { active: Boolean(active) })}
					aria-hidden="true"
				>
						{active && <WorkItemMedia work={active} />}
					</div>
				</div>

				<ProjectViewer work={viewing} onClose={() => setViewing(null)} />

				<Link href="/portfolio" className={`${cx('view-all')} link-underline`}>
					View all work <span aria-hidden="true">→</span>
				</Link>
			</Container>
		</section>
	);
}

HomeFeaturedWork.fragments = {
	entry: gql`
		${WorkItemMedia.fragments.entry}
		fragment HomeFeaturedWorkFragment on Work {
			title
			slug
			date
			workTypes {
				nodes {
					name
				}
			}
			...WorkMediaFragment
		}
	`,
};
