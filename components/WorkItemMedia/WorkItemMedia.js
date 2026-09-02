import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import classNames from 'classnames/bind';
import { VIDEO_FILE_PATTERN } from '../../constants/media';
import { getSafeHttpUrl } from '../../utils/urls';
import styles from './WorkItemMedia.module.scss';

let cx = classNames.bind(styles);

// ponytail: a grid tile only has room for a real <video> background, not an
// embed — a video-format work whose meta is a YouTube/Vimeo link falls back
// to the featured image rather than an autoplaying iframe.
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

// Grid tile background, driven by the work's post format: "video" plays its
// video meta, "gallery" cycles its gallery meta as a slideshow, everything
// else — including a video/gallery format work whose meta is empty — falls
// back to the plain featured image.
export default function WorkItemMedia({ work }) {
	const formatSlug = work?.postFormats?.nodes?.[0]?.slug;
	const videoUrl = getSafeHttpUrl(work?.workVideoUrl);
	const gallery = work?.workGallery ?? [];
	const featuredImage = work?.featuredImage?.node;

	if (formatSlug === 'post-format-video' && videoUrl && VIDEO_FILE_PATTERN.test(videoUrl)) {
		return (
			<video
				className={cx('video')}
				src={videoUrl}
				poster={featuredImage?.sourceUrl}
				autoPlay
				muted
				loop
				playsInline
				preload="none"
			/>
		);
	}

	if (formatSlug === 'post-format-gallery' && gallery.length > 0) {
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
			workGallery {
				sourceUrl
				altText
			}
			postFormats {
				nodes {
					slug
				}
			}
		}
	`,
};
