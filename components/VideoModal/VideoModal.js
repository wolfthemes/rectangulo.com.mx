import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { VIDEO_FILE_PATTERN } from '../../constants/media';
import { getSafeEmbedUrl, getSafeHttpUrl } from '../../utils/urls';
import { useT } from '../../lib/i18n';
import { youtubeId } from '../../lib/youtube';
import styles from './VideoModal.module.scss';

let cx = classNames.bind(styles);

// Native <dialog>: showModal() gives focus trap, Esc-to-close and inert
// background for free. `children` renders beside the video (project info).
export default function VideoModal({ open, onClose, src, title, children, sourceRect, poster, openKey }) {
	const ref = useRef(null);
	const videoBoxRef = useRef(null);
	const t = useT();
	// Files play in <video>; anything else must be an allow-listed embed host.
	const fileUrl = VIDEO_FILE_PATTERN.test(src ?? '') ? getSafeHttpUrl(src) : null;
	const ytId = fileUrl ? null : youtubeId(src);
	// A plain youtube.com/watch?v= URL won't play in an <iframe> — only the
	// /embed/ form does (same rewrite single-work.js's inline player uses).
	const embedUrl = fileUrl ? null : ytId ? `https://www.youtube.com/embed/${ytId}` : getSafeEmbedUrl(src);
	// The thumbnail-morph clone: starts at the caller-supplied sourceRect
	// (where the hover preview was on screen), then gets nudged to the video
	// slot's own rect a frame later so the CSS transition has something to
	// animate between. null means "not morphing" — no sourceRect (no hover
	// preview was on screen, e.g. mobile or keyboard open) just skips it, and
	// .media's own CSS transition reveals the video in place instead.
	const [morphRect, setMorphRect] = useState(null);
	// Which openKey the morph sequence below has already run for — the source
	// of truth for "is this a fresh open", not the native dialog's own `open`
	// property. That property's timing around close() (exit transitions,
	// focus restoration, browser-specific deferral) turned out unreliable
	// across repeated open/close cycles; openKey is a plain counter the
	// caller bumps exactly once per real click, so it can't lie.
	const handledKeyRef = useRef(null);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;

		if (open) {
			if (!dialog.open) {
				// showModal() throws if the dialog believes it's still open (e.g.
				// a browser still finishing the previous close) — don't let that
				// wedge every future open.
				try {
					dialog.showModal();
				} catch {
					dialog.close();
					dialog.showModal();
				}
			}
		} else {
			if (dialog.open) dialog.close();
			return;
		}

		if (handledKeyRef.current === openKey) return;
		handledKeyRef.current = openKey;

		// Always clear any clone left over from a previous open first —
		// onTransitionEnd below is the normal cleanup path, but a transition
		// that gets interrupted (closed mid-flight) or never starts (this open
		// has no sourceRect) fires transitioncancel, not transitionend, so
		// that cleanup can be skipped entirely. Since this component never
		// unmounts between opens, a skipped cleanup left morphRect's stale
		// value — frozen, and from the wrong project — ready to render again
		// next time, blocking the video.
		setMorphRect(null);

		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (sourceRect && poster && !reduce) {
			// Both state updates deferred into rAF callbacks, not called
			// directly in the effect body: the first paints the clone at
			// sourceRect, the second (a frame later) nudges it to the video
			// slot's rect so the CSS transition has something to animate
			// between.
			requestAnimationFrame(() => {
				setMorphRect(sourceRect);
				requestAnimationFrame(() => {
					// The video's own box, not .media's padded container — they
					// have to land on the exact same rect for the swap to read as
					// one continuous element rather than a jump cut.
					const target = videoBoxRef.current?.getBoundingClientRect();
					if (target) setMorphRect(target);
				});
			});
		}
	}, [open, openKey, sourceRect, poster]);

	// Belt-and-suspenders cleanup: don't rely solely on the morph <img>'s own
	// transitionend (skipped on an interrupted/canceled transition) to clear
	// it. Whenever morphRect changes, arm a timeout a little past the
	// transition's own duration (.morph, VideoModal.module.scss) that nulls
	// it regardless.
	useEffect(() => {
		if (morphRect === null) return undefined;
		const timeout = setTimeout(() => setMorphRect(null), 650);
		return () => clearTimeout(timeout);
	}, [morphRect]);

	return (
		<dialog ref={ref} className={cx('component')} onClose={onClose} aria-label={title}>
			{/* Curtain: clip-path reveal lives here rather than on .component
			    itself, so the morph clone below (a sibling, not a descendant)
			    isn't clipped along with it and can fly freely across the
			    screen while the panel underneath is still wiping in. Keyed: a
			    real remount each open, same reasoning as .close/.videoBox below
			    — this component never unmounts on its own, and restarting a CSS
			    animation by relying on the dialog's native display toggling
			    proved unreliable across repeated open/close cycles. */}
			<div key={openKey} className={cx('curtain')}>
				<button type="button" className={cx('close')} onClick={() => ref.current?.close()}>
					{t({ es: 'Cerrar', en: 'Close' })}
				</button>
				<div className={cx('layout')}>
					{children && <div className={cx('info')}>{children}</div>}
					{/* WORK brief p.8: "dark/black background with subtle grain" for the
					    video area. */}
					<div className={`${cx('media')} grain`}>
						{/* The exact video-sized box (not .media's padded one) — what
						    the morph target and reveal fade are measured/applied
						    against, so the clone and the real video land on the same
						    rect. Remounts along with .curtain above (keyed there). */}
						<div ref={videoBoxRef} className={cx('videoBox')}>
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
				</div>
			</div>
			{open && morphRect && (
				<img
					className={cx('morph')}
					src={poster}
					alt=""
					style={{ left: morphRect.left, top: morphRect.top, width: morphRect.width, height: morphRect.height }}
					onTransitionEnd={(e) => {
						// Four properties transition together (left/top/width/height) —
						// react to just one so this doesn't fire (and no-op) four times.
						if (e.propertyName === 'left') setMorphRect(null);
					}}
				/>
			)}
		</dialog>
	);
}
