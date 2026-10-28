import classNames from 'classnames/bind';
import Link from 'next/link';
import { CREDIT_FIELDS } from '../../constants/credits';
import { extractContentVideoUrl, resolveVideoFileUrl } from '../../utils/urls';
import { SafeHtml } from '../SafeHtml';
import { VideoModal } from '../VideoModal';
import { useT } from '../../lib/i18n';
import styles from './ProjectViewer.module.scss';

let cx = classNames.bind(styles);

// Overlay for a single work (HOME p.9, WORK p.7-8): info + credits beside the
// video. Closing just closes the <dialog>, so the page underneath keeps its
// exact scroll position — nothing navigates.
export default function ProjectViewer({ work, onClose, onPrev, onNext, sourceRect, openKey }) {
	const t = useT();
	const category = work?.workTypes?.nodes?.[0]?.name;
	const year = work?.workYear || (work?.date && new Date(work.date).getFullYear());
	// Custom fields by key; the dedicated Client meta wins over a `client` custom field.
	const custom = Object.fromEntries((work?.workCredits ?? []).map(({ key, value }) => [key, value]));
	if (work?.workClient) custom.client = work.workClient;
	const known = CREDIT_FIELDS.filter(([key]) => custom[key]).map(([key, label]) => [key, t(label), custom[key]]);
	const extra = Object.entries(custom)
		.filter(([key]) => !CREDIT_FIELDS.some(([k]) => k === key))
		.map(([key, value]) => [key, key.replace(/[_-]+/g, ' '), value]);
	const credits = [...known, ...extra];
	// Full-size meta first, then the preview, then whatever video the post
	// content itself embeds — only reached once no video meta exists at all.
	const videoSrc =
		resolveVideoFileUrl(work?.workVideoFullUrl) ||
		resolveVideoFileUrl(work?.workVideoUrl) ||
		resolveVideoFileUrl(extractContentVideoUrl(work?.content));
	// Same featured image the list's own hover preview already shows — the
	// morph clone is just that image flying from its on-screen rect to the
	// video slot, so it needs no media of its own.
	const poster = work?.featuredImage?.node?.sourceUrl;

	// Stagger index for the mask-up reveal, one per rendered line — a plain
	// counter rather than a fixed per-element number since category/
	// description are conditional and would otherwise leave gaps.
	let line = 0;

	return (
		<VideoModal
			open={Boolean(work)}
			onClose={onClose}
			src={videoSrc}
			title={work?.title}
			sourceRect={sourceRect}
			poster={poster}
			openKey={openKey}
		>
			{/* Keyed so every fresh open replays the line-by-line reveal from
			    scratch — openKey only changes on open, not on a future
			    prev/next, so that doesn't replay this (yet). */}
			<div key={openKey} className={cx('content')}>
				<h2 className={cx('title')} style={{ '--i': line++ }}>
					{work?.title}
				</h2>
				{category && (
					<p className={cx('category')} style={{ '--i': line++ }}>
						({category})
					</p>
				)}
				{work?.excerpt && (
					<div className={cx('description')} style={{ '--i': line++ }}>
						<SafeHtml html={work.excerpt} />
					</div>
				)}

				<div className={cx('sheet')} style={{ '--i': line++ }}>
					{(year || work?.workFormato) && (
						<p className={cx('year')}>{[year, work?.workFormato].filter(Boolean).join(' · ')}</p>
					)}
					{credits.length > 0 && (
						<>
							<p className={cx('creditsHeading')}>{t({ es: 'Créditos', en: 'Credits' })}</p>
							<dl className={cx('credits')}>
								{credits.map(([key, label, value]) => (
									<div key={key} className={cx('creditRow')}>
										<dt>{label}</dt>
										<dd>{value}</dd>
									</div>
								))}
							</dl>
						</>
					)}
				</div>

				<div className={cx('actions')}>
					{work?.slug && (
						<Link href={`/work/${work.slug}`} className={cx('moreInfo')}>
							{t({ es: 'Más información', en: 'More info' })}
						</Link>
					)}

					{(onPrev || onNext) && (
						<nav className={cx('nav')} aria-label={t({ es: 'Navegación de proyectos', en: 'Project navigation' })}>
							<button type="button" onClick={onPrev} disabled={!onPrev}>
								← {t({ es: 'Anterior', en: 'Previous' })}
							</button>
							<button type="button" onClick={onNext} disabled={!onNext}>
								{t({ es: 'Siguiente', en: 'Next' })} →
							</button>
						</nav>
					)}
				</div>
			</div>
		</VideoModal>
	);
}
