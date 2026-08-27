import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { Container } from '../Container';
import { observeItemsInView } from '../../lib/animate-headings';
import { getLenis } from '../../lib/scroll';
import { youtubeId } from '../../lib/youtube';
import styles from './VideoGrid.module.scss';

if (typeof window !== 'undefined') gsap.registerPlugin(Flip);

let cx = classNames.bind(styles);

const EASE = 'power3.inOut';
const DURATION = 0.6;

function Card({ video, index, onOpen, imgRef }) {
	const { title, preview } = video;
	const [hovered, setHovered] = useState(false);
	const videoRef = useRef(null);

	useEffect(() => {
		if (!videoRef.current) return;
		if (hovered) videoRef.current.play().catch(() => {});
		else videoRef.current.pause();
	}, [hovered]);

	return (
		<li
			className={cx(['card', 'is-animated-item'])}
			style={{ '--item-index': index }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<button type="button" className={cx('trigger')} onClick={() => onOpen(index)}>
				<img ref={imgRef} className={cx('image')} src={video.image} alt="" loading="lazy" />
				{preview && (
					<video
						ref={videoRef}
						className={cx('preview')}
						src={hovered ? preview : undefined}
						muted
						loop
						playsInline
						preload="none"
					/>
				)}
				<span className={cx('titleWrap')}>
					<span className={cx('marquee')}>
						<span className={cx('title')}>{title}</span>
						<span className={cx('title')} aria-hidden="true">
							{title}
						</span>
					</span>
				</span>
			</button>
		</li>
	);
}

// Expanded frame: a GSAP Flip.fit shared-element transition — snaps onto the
// clicked card's thumbnail element, then expands to fill the viewport (a
// hidden `viewportRef` div stands in for "the viewport" since Flip.fit only
// accepts a real element as its target, not a plain rect — it reads the
// target's own getBoundingClientRect()). Flip scales/translates the frame as
// a box; the video/iframe inside just rides along, so a card whose aspect
// ratio differs a lot from the viewport briefly looks stretched mid-
// transition — the standard, accepted trade-off of this technique, not
// worth correcting for here. Full-res video starts playing once the expand
// settles. `close` (exposed via ref) reverses the same tween back onto
// `cardEl` — VideoGrid calls it, then unmounts this.
const Frame = forwardRef(function Frame({ video, cardEl, viewportEl, onClose }, ref) {
	const frameRef = useRef(null);
	const videoRef = useRef(null);
	const ytId = youtubeId(video.full);

	useEffect(() => {
		const el = frameRef.current;
		if (!el || !cardEl || !viewportEl) return;

		Flip.fit(el, cardEl, { scale: true, duration: 0 });
		Flip.fit(el, viewportEl, {
			scale: true,
			duration: DURATION,
			ease: EASE,
			onComplete: () => videoRef.current?.play().catch(() => {}),
		});
		// cardEl/viewportEl are stable for this mount — only mount should
		// trigger the expand.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useImperativeHandle(ref, () => ({
		close(onDone) {
			videoRef.current?.pause();
			Flip.fit(frameRef.current, cardEl, {
				scale: true,
				duration: DURATION,
				ease: EASE,
				onComplete: onDone,
			});
		},
	}));

	return (
		<div className={cx('frame')} ref={frameRef}>
			<button type="button" className={cx('close')} onClick={onClose} aria-label="Close">
				×
			</button>
			{ytId ? (
				<iframe
					className={cx('media')}
					src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
					title={video.title}
					allow="autoplay; encrypted-media; picture-in-picture"
					allowFullScreen
				/>
			) : (
				<video
					ref={videoRef}
					className={cx('media')}
					src={video.full}
					controls
					playsInline
					poster={video.image}
				/>
			)}
		</div>
	);
});

// `videos`: undefined/null while the query hasn't resolved, [] once resolved
// and genuinely empty — same loading/empty distinction as PortfolioGrid.
export default function VideoGrid({ videos }) {
	const [openIndex, setOpenIndex] = useState(null);
	const [closing, setClosing] = useState(false);
	const imgRefs = useRef([]);
	const viewportRef = useRef(null);
	const frameRef = useRef(null);

	useEffect(() => {
		if (videos) observeItemsInView(`.${styles.card}`);
	}, [videos]);

	function handleOpen(index) {
		// Scroll locked for the duration the frame is open — the card stays in
		// place underneath it either way, so its live rect is always valid.
		getLenis()?.stop();
		document.documentElement.style.overflow = 'hidden';
		setOpenIndex(index);
	}

	function handleClose() {
		if (!frameRef.current || closing) return;
		setClosing(true);
		frameRef.current.close(() => {
			getLenis()?.start();
			document.documentElement.style.overflow = '';
			setOpenIndex(null);
			setClosing(false);
		});
	}

	useEffect(() => {
		if (openIndex === null) return;
		function onKeyDown(e) {
			if (e.key === 'Escape') handleClose();
		}
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openIndex, closing]);

	return (
		<section className={cx('component')}>
			<Container>
				{videos && (
					<ul className={cx('grid')}>
						{videos.map((video, index) => (
							<Card
								key={video.title}
								video={video}
								index={index}
								onOpen={handleOpen}
								imgRef={(el) => (imgRefs.current[index] = el)}
							/>
						))}
					</ul>
				)}
			</Container>
			<div ref={viewportRef} className={cx('viewportSizer')} aria-hidden="true" />
			{openIndex !== null && (
				<Frame
					ref={frameRef}
					video={videos[openIndex]}
					cardEl={imgRefs.current[openIndex]}
					viewportEl={viewportRef.current}
					onClose={handleClose}
				/>
			)}
		</section>
	);
}
