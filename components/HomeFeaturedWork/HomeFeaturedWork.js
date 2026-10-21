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

// How much of the remaining distance to the cursor the preview closes per
// frame — lower trails more, 1 would be an instant snap (no lerp at all).
const LERP = 0.15;

// Brief section 05/06: a curated, numbered selection (not the full archive —
// that's /portfolio) with a hover preview; a click opens the ProjectViewer
// overlay in place (the link href is only the new-tab / no-JS fallback).
export default function HomeFeaturedWork({ works }) {
	const [activeIndex, setActiveIndex] = useState(null);
	const [viewing, setViewing] = useState(null);
	// Gates the preview's visibility, not just its hover state: on the
	// fixed+transform desktop layout, `active` can flip true via a scroll
	// that moves the row under a stationary cursor (no mousemove), before
	// the preview's transform has ever been positioned — showing it then
	// flashes it at its untransformed (0,0) spot, top-left of the viewport.
	// Below FOLLOW_QUERY the preview is sticky/untransformed, so it's ready
	// from the start.
	const [ready, setReady] = useState(false);
	const layoutRef = useRef(null);
	const previewRef = useRef(null);

	// Keyed on works?.length, not []: `works` is still null while the query
	// loads, so the component renders nothing yet and layoutRef.current is
	// null the first time this runs — with an empty dep array that bail-out
	// would be permanent, since nothing re-triggers it once real content (and
	// the ref) actually exists.
	useEffect(() => {
		const layout = layoutRef.current;
		if (!layout) return undefined;

		const mq = window.matchMedia(FOLLOW_QUERY);
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Target is wherever the cursor last was; current trails it a fraction
		// of the way per frame (lerp) instead of snapping straight there.
		const target = { x: 0, y: 0 };
		const current = { x: 0, y: 0 };
		let started = false;
		let raf = 0;

		// Non-follow layouts have no transform to wait on.
		setReady(!mq.matches);

		const onMove = (e) => {
			if (!mq.matches) return;
			// Offset so the preview sits beside the cursor, not under it.
			target.x = e.clientX + 32;
			target.y = e.clientY - 120;
			if (!started) {
				// First move: jump straight there instead of lerping in from (0,0).
				current.x = target.x;
				current.y = target.y;
				started = true;
				setReady(true);
			}
			if (reduce && previewRef.current) {
				previewRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
			}
		};

		const tick = () => {
			current.x += (target.x - current.x) * LERP;
			current.y += (target.y - current.y) * LERP;
			if (previewRef.current) {
				previewRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
			}
			raf = requestAnimationFrame(tick);
		};

		layout.addEventListener('mousemove', onMove);
		if (!reduce) raf = requestAnimationFrame(tick);

		return () => {
			layout.removeEventListener('mousemove', onMove);
			cancelAnimationFrame(raf);
		};
	}, [works?.length]);

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
					className={cx('preview', { active: Boolean(active) && ready })}
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
