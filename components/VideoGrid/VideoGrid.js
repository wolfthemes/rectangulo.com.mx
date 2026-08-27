import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import Lightbox from 'yet-another-react-lightbox';
import VideoPlugin from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';
import { Container } from '../Container';
import { observeItemsInView } from '../../lib/animate-headings';
import { youtubeId } from '../../lib/youtube';
import styles from './VideoGrid.module.scss';

let cx = classNames.bind(styles);

function Card({ video, index, onOpen }) {
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
				<img className={cx('image')} src={video.image} alt="" loading="lazy" />
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

// `videos`: undefined/null while the query hasn't resolved, [] once resolved
// and genuinely empty — same loading/empty distinction as PortfolioGrid.
export default function VideoGrid({ videos }) {
	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		if (videos) observeItemsInView(`.${styles.card}`);
	}, [videos]);

	const slides = (videos ?? []).map(({ title, full }) => {
		const ytId = youtubeId(full);

		return ytId
			? { type: 'youtube', ytId, title }
			: { type: 'video', title, sources: full ? [{ src: full, type: 'video/mp4' }] : [] };
	});

	return (
		<section className={cx('component')}>
			<Container>
				{videos && (
					<ul className={cx('grid')}>
						{videos.map((video, index) => (
							<Card key={video.title} video={video} index={index} onOpen={setOpenIndex} />
						))}
					</ul>
				)}
			</Container>
			<Lightbox
				open={openIndex !== null}
				close={() => setOpenIndex(null)}
				index={openIndex ?? 0}
				slides={slides}
				plugins={[VideoPlugin]}
				render={{
					slide: ({ slide }) =>
						slide.type === 'youtube' ? (
							<iframe
								className={cx('youtube')}
								src={`https://www.youtube.com/embed/${slide.ytId}?autoplay=1`}
								title={slide.title}
								allow="autoplay; encrypted-media; picture-in-picture"
								allowFullScreen
							/>
						) : undefined,
				}}
			/>
		</section>
	);
}
