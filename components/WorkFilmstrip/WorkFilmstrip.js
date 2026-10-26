import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { ALL_FILTER, matchesFilter } from '../../constants/work-filters';
import { ProjectViewer } from '../ProjectViewer';
import { WorkFilters } from '../WorkFilters';
import { WorkItemMedia } from '../WorkItemMedia';
import { useT } from '../../lib/i18n';
import styles from './WorkFilmstrip.module.scss';

let cx = classNames.bind(styles);

// Desktop only: vertical scroll drives the horizontal track while the strip is
// pinned (WORK p.4/p.9). Mobile and reduced-motion keep native horizontal
// swipe — no scroll-jacking.
const PIN_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

// WORK brief p.6: the strip itself is capped to 7 tiles regardless of how
// many match the active filter — the 7th tile's "07 / N" index is what
// surfaces the fuller count (see Tile below), not more tiles.
const MAX_TILES = 7;

function Tile({ work, index, total, onOpen, onVisible }) {
	const ref = useRef(null);
	const t = useT();

	// Loops play only while in view (WORK p.5) and stop on exit.
	useEffect(() => {
		const el = ref.current;
		const video = el?.querySelector('video');
		const io = new IntersectionObserver(([entry]) => {
			onVisible(index, entry.isIntersecting);
			if (!video) return;
			if (entry.isIntersecting) video.play().catch(() => {});
			else video.pause();
		});
		io.observe(el);
		return () => {
			io.disconnect();
			onVisible(index, false);
		};
	}, [index, onVisible]);

	const category = work.workTypes?.nodes?.[0]?.name;
	const year = work.workYear || (work.date && new Date(work.date).getFullYear());

	return (
		<li ref={ref} className={cx('tile')}>
			<button type="button" className={cx('open')} onClick={() => onOpen(index)}>
				<WorkItemMedia work={work} manual />
				<span className={cx('index')}>
					{/* Brief p.6: the 7th tile also carries the active filter's total
					    count ("07 / 32") — every other tile stays a bare index. */}
					{index === 6
						? `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
						: String(index + 1).padStart(2, '0')}
				</span>
				<span className={cx('hover')}>
					<span className={cx('title')}>{work.title}</span>
					<span>{[category, year].filter(Boolean).join(' · ')}</span>
					<span className={cx('view')}>{t({ es: 'Ver proyecto', en: 'View project' })} →</span>
				</span>
			</button>
		</li>
	);
}

export default function WorkFilmstrip({ works }) {
	const t = useT();
	const [filter, setFilter] = useState(ALL_FILTER);
	const [viewing, setViewing] = useState(null);
	const [visible, setVisible] = useState(() => new Set());
	const [pinned, setPinned] = useState(false);
	const outerRef = useRef(null);
	const trackRef = useRef(null);
	const filtersBarRef = useRef(null);

	const matched = works.filter((w) => matchesFilter(w, filter));
	const shown = matched.slice(0, MAX_TILES);
	const current = visible.size ? Math.max(...visible) + 1 : 0;

	const onVisible = (index, isVisible) =>
		setVisible((prev) => {
			if (prev.has(index) === isVisible) return prev;
			const next = new Set(prev);
			if (isVisible) next.add(index);
			else next.delete(index);
			return next;
		});

	useEffect(() => {
		const mq = window.matchMedia(PIN_QUERY);
		const sync = () => setPinned(mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	}, []);

	// Pin math: the outer block is as tall as the horizontal distance to
	// travel plus one viewport; the sticky inner stage stays put meanwhile.
	// Once the distance is covered the stage unsticks — that's the pin release
	// before the CTA (WORK p.10).
	useEffect(() => {
		const outer = outerRef.current;
		const track = trackRef.current;
		if (!outer || !track) return;
		if (!pinned) {
			outer.style.height = '';
			track.style.transform = '';
			return;
		}
		let raf = 0;
		const layout = () => {
			const distance = Math.max(track.scrollWidth - window.innerWidth, 0);
			outer.style.height = `${distance + window.innerHeight}px`;
			// Stage pins below the filters bar, not at the viewport edge — keeps
			// the gap between them once both are stuck (its height varies with
			// the clamp() padding and is cheaper to measure than to duplicate in CSS).
			outer.style.setProperty('--filters-h', `${filtersBarRef.current?.offsetHeight ?? 0}px`);
			update();
		};
		const update = () => {
			raf = 0;
			const distance = Math.max(track.scrollWidth - window.innerWidth, 0);
			const progress = Math.min(Math.max(-outer.getBoundingClientRect().top, 0), distance);
			track.style.transform = `translate3d(${-progress}px,0,0)`;
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		layout();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', layout);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', layout);
		};
	}, [pinned, filter, shown.length]);

	const changeFilter = (next) => {
		setFilter(next);
		setVisible(new Set());
		// Back to the top of the strip so the new result starts at tile 01.
		if (trackRef.current) trackRef.current.scrollLeft = 0;
	};

	const viewed = viewing != null ? shown[viewing] : null;

	return (
		<section className={cx('component')}>
			<div ref={filtersBarRef} className={cx('filtersBar')}>
				<WorkFilters active={filter} onChange={changeFilter} works={works} />
				<p className={cx('counter')} aria-live="polite">
					{String(current).padStart(2, '0')} / {String(matched.length).padStart(2, '0')}
				</p>
			</div>

			<div ref={outerRef} className={cx('outer')}>
				<div className={cx('stage')}>
					{shown.length ? (
						<ul ref={trackRef} className={cx('track')}>
							{shown.map((work, i) => (
								<Tile
									key={work.slug}
									work={work}
									index={i}
									total={matched.length}
									onOpen={setViewing}
									onVisible={onVisible}
								/>
							))}
						</ul>
					) : (
						<p className={cx('empty')}>
								{t({ es: '[POR PROPORCIONAR: proyectos para esta categoría]', en: '[TO BE PROVIDED: projects for this category]' })}
							</p>
					)}
				</div>
			</div>

			<ProjectViewer
				work={viewed}
				onClose={() => setViewing(null)}
				onPrev={viewing > 0 ? () => setViewing(viewing - 1) : undefined}
				onNext={viewing != null && viewing < shown.length - 1 ? () => setViewing(viewing + 1) : undefined}
			/>
		</section>
	);
}
