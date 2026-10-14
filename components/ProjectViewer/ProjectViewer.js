import classNames from 'classnames/bind';
import { CREDIT_FIELDS } from '../../constants/credits';
import { getSafeHttpUrl } from '../../utils/urls';
import { SafeHtml } from '../SafeHtml';
import { VideoModal } from '../VideoModal';
import styles from './ProjectViewer.module.scss';

let cx = classNames.bind(styles);

// Overlay for a single work (HOME p.9, WORK p.7-8): info + credits beside the
// video. Closing just closes the <dialog>, so the page underneath keeps its
// exact scroll position — nothing navigates.
export default function ProjectViewer({ work, onClose, onPrev, onNext }) {
	const category = work?.workTypes?.nodes?.[0]?.name;
	const year = work?.date && new Date(work.date).getFullYear();
	const credits = work ? CREDIT_FIELDS.filter(([key]) => work[key]) : [];

	return (
		<VideoModal open={Boolean(work)} onClose={onClose} src={getSafeHttpUrl(work?.workVideoUrl)} title={work?.title}>
			<h2 className={cx('title')}>{work?.title}</h2>
			<p className={cx('meta')}>{[category, year].filter(Boolean).join(' · ')}</p>
			{work?.excerpt && <SafeHtml html={work.excerpt} />}
			{credits.length > 0 && (
				<dl className={cx('credits')}>
					{credits.map(([key, label]) => (
						<div key={key}>
							<dt>{label}</dt>
							<dd>{work[key]}</dd>
						</div>
					))}
				</dl>
			)}
			{(onPrev || onNext) && (
				<nav className={cx('nav')} aria-label="Project navigation">
					<button type="button" onClick={onPrev} disabled={!onPrev}>
						← Previous
					</button>
					<button type="button" onClick={onNext} disabled={!onNext}>
						Next →
					</button>
				</nav>
			)}
		</VideoModal>
	);
}
