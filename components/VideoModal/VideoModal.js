import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { VIDEO_FILE_PATTERN } from '../../constants/media';
import styles from './VideoModal.module.scss';

let cx = classNames.bind(styles);

// Native <dialog>: showModal() gives focus trap, Esc-to-close and inert
// background for free. `children` renders beside the video (project info).
export default function VideoModal({ open, onClose, src, title, children }) {
	const ref = useRef(null);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	return (
		<dialog ref={ref} className={cx('component')} onClose={onClose} aria-label={title}>
			<button type="button" className={cx('close')} onClick={() => ref.current?.close()}>
				Close
			</button>
			<div className={cx('layout')}>
				{children && <div className={cx('info')}>{children}</div>}
				<div className={cx('media')}>
					{/* Unmounted when closed so playback stops and nothing buffers. */}
					{!open ? null : !src ? (
						<p>[À FOURNIR : vidéo]</p>
					) : VIDEO_FILE_PATTERN.test(src) ? (
						<video src={src} controls autoPlay playsInline />
					) : (
						<iframe src={src} title={title} allow="autoplay; fullscreen" allowFullScreen />
					)}
				</div>
			</div>
		</dialog>
	);
}
