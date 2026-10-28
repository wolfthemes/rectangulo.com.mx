import classNames from 'classnames/bind';
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
export default function ProjectViewer({ work, onClose, onPrev, onNext }) {
	const t = useT();
	const category = work?.workTypes?.nodes?.[0]?.name;
	const year = work?.date && new Date(work.date).getFullYear();
	const credits = work ? CREDIT_FIELDS.filter(([key]) => work[key]) : [];
	// Full-size meta first, then the preview, then whatever video the post
	// content itself embeds — only reached once no video meta exists at all.
	const videoSrc =
		resolveVideoFileUrl(work?.workVideoFullUrl) ||
		resolveVideoFileUrl(work?.workVideoUrl) ||
		resolveVideoFileUrl(extractContentVideoUrl(work?.content));

	return (
		<VideoModal open={Boolean(work)} onClose={onClose} src={videoSrc} title={work?.title}>
			<h2 className={cx('title')}>{work?.title}</h2>
			{category && <p className={cx('category')}>({category})</p>}
			{work?.excerpt && (
				<div className={cx('description')}>
					<SafeHtml html={work.excerpt} />
				</div>
			)}

			<div className={cx('sheet')}>
				{year && <p className={cx('year')}>{year}</p>}
				{credits.length > 0 && (
					<>
						<p className={cx('creditsHeading')}>{t({ es: 'Créditos', en: 'Credits' })}</p>
						<dl className={cx('credits')}>
							{credits.map(([key, label]) => (
								<div key={key} className={cx('creditRow')}>
									<dt>{t(label)}</dt>
									<dd>{work[key]}</dd>
								</div>
							))}
						</dl>
					</>
				)}
			</div>

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
		</VideoModal>
	);
}
