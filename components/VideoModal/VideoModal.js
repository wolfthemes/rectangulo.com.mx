import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { VIDEO_FILE_PATTERN } from '../../constants/media';
import { getSafeEmbedUrl, getSafeHttpUrl } from '../../utils/urls';
import { useT } from '../../lib/i18n';
import styles from './VideoModal.module.scss';

let cx = classNames.bind(styles);

// Native <dialog>: showModal() gives focus trap, Esc-to-close and inert
// background for free. `children` renders beside the video (project info).
export default function VideoModal({ open, onClose, src, title, children }) {
	const ref = useRef(null);
	const t = useT();
	// Files play in <video>; anything else must be an allow-listed embed host.
	const fileUrl = VIDEO_FILE_PATTERN.test(src ?? '') ? getSafeHttpUrl(src) : null;
	const embedUrl = fileUrl ? null : getSafeEmbedUrl(src);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	return (
		<dialog ref={ref} className={cx('component')} onClose={onClose} aria-label={title}>
			<button type="button" className={cx('close')} onClick={() => ref.current?.close()}>
				{t({ es: 'Cerrar', en: 'Close' })}
				</button>
			<div className={cx('layout')}>
				{children && <div className={cx('info')}>{children}</div>}
				{/* WORK brief p.8: "dark/black background with subtle grain" for the
				    video area. */}
				<div className={`${cx('media')} grain`}>
					{/* Unmounted when closed so playback stops and nothing buffers. */}
					{!open ? null : fileUrl ? (
						<video src={fileUrl} controls autoPlay playsInline />
					) : embedUrl ? (
						<iframe
							src={embedUrl}
							title={title}
							sandbox="allow-scripts allow-same-origin allow-presentation"
							allow="autoplay; fullscreen"
							allowFullScreen
						/>
					) : (
						<p>{t({ es: '[POR PROPORCIONAR: video]', en: '[TO BE PROVIDED: video]' })}</p>
					)}
				</div>
			</div>
		</dialog>
	);
}
