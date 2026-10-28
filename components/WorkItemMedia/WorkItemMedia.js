import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import classNames from 'classnames/bind';
import { VIDEO_FILE_PATTERN } from '../../constants/media';
import { extractContentVideoUrl, getSafeHttpUrl } from '../../utils/urls';
import styles from './WorkItemMedia.module.scss';

let cx = classNames.bind(styles);

// ponytail: a grid tile only has room for a real <video> background, not an
// embed — a work whose only video is a YouTube/Vimeo link falls back to the
// featured image rather than an autoplaying iframe.
function GallerySlideshow({ images }) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (images.length < 2) return;
		const id = setInterval(() => {
			setIndex((i) => (i + 1) % images.length);
		}, 2200);
		return () => clearInterval(id);
	}, [images.length]);

	return (
		<div className={cx('slideshow')}>
			{/* All slides stay mounted — only the `active` class toggles, so the
			    CSS opacity transition has a real 0 → 1 frame to animate. */}
			{images.map((image, i) => (
				<img
					key={image.sourceUrl}
					className={cx('slide', { active: i === index })}
					src={image.sourceUrl}
					alt={image.altText || ''}
					loading="lazy"
				/>
			))}
		</div>
	);
}

// Grid tile background, driven by the work's own post meta rather than its
// post format taxonomy — a work can carry a video meta without the format
// term being set to "video" (or vice versa), so go by what's actually there:
// a self-hosted video file plays, else a gallery cycles as a slideshow, else
// the plain featured image.
// `manual`: the parent starts/stops the video (play only while in view).
export default function WorkItemMedia({ work, manual = false }) {
	// Preview meta first; only look at post content once no meta exists at all.
	const videoUrl =
		getSafeHttpUrl(work?.workVideoUrl) || getSafeHttpUrl(extractContentVideoUrl(work?.content));
	const gallery = work?.workGallery ?? [];
	const featuredImage = work?.featuredImage?.node;

	if (videoUrl && VIDEO_FILE_PATTERN.test(videoUrl)) {
		return (
			<video
				className={cx('video')}
				src={videoUrl}
				poster={featuredImage?.sourceUrl}
				autoPlay={!manual}
				muted
				loop
				playsInline
				preload={manual ? "none" : "auto"}
			/>
		);
	}

	if (gallery.length > 0) {
		return (
			<>
				<img
					className={cx('fallback')}
					src={featuredImage?.sourceUrl}
					alt={featuredImage?.altText || ''}
					loading="lazy"
				/>
				<GallerySlideshow images={gallery} />
			</>
		);
	}

	return (
		<img
			className={cx('fallback')}
			src={featuredImage?.sourceUrl}
			alt={featuredImage?.altText || ''}
			loading="lazy"
		/>
	);
}

// Fragment for whatever query fetches the grid's `work` nodes — spread it in
// alongside FeaturedImageFragment.
WorkItemMedia.fragments = {
	entry: gql`
		fragment WorkMediaFragment on Work {
			workVideoUrl
			workVideoFullUrl
			content
			workGallery {
				sourceUrl
				altText
			}
		}
	`,
};
