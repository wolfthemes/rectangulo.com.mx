import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onScrollFrame } from '../../lib/scroll';
import styles from './FondoInfinitoDiagram.module.scss';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

let cx = classNames.bind(styles);

// Scroll-drawn floor-plan diagram: the room's outline, dimension lines and
// headline numbers draw themselves in as the section scrolls through view,
// pinned for the duration (see FondoInfinitoDiagram.module.scss's .stage).
// Scroll position is Lenis-driven (lib/scroll.js), not native — ScrollTrigger
// needs an explicit nudge on every Lenis frame or its scrub lags a frame
// behind the (already-smoothed) scroll position.
const DRAWN_SELECTORS = [
	'#frontLeft',
	'#frontRight',
	'#frontFloorL',
	'#frontFloorR',
	'#outerTop',
	'#outerBottom',
	'#outerLeft',
	'#outerRight',
	'#grid path',
	'#dimW path',
	'#dimH path',
	'#dimD path',
	'#backRect',
];

export default function FondoInfinitoDiagram() {
	const stageRef = useRef(null);

	useEffect(() => {
		const root = stageRef.current;
		if (!root) return;

		const lines = DRAWN_SELECTORS.flatMap((selector) => Array.from(root.querySelectorAll(selector)));
		const labels = root.querySelectorAll('.dimlabel');
		const numbers = root.querySelector('#numbers');

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) {
			lines.forEach((el) => (el.style.strokeDasharray = 'none'));
			return;
		}

		lines.forEach((el) => {
			const len = el.getTotalLength();
			el.style.strokeDasharray = len;
			el.style.strokeDashoffset = len;
		});
		gsap.set(labels, { opacity: 0 });
		gsap.set(numbers, { opacity: 0, scale: 0.7, transformOrigin: '100% 50%' });

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: root,
				start: 'top top',
				end: '+=200%',
				scrub: 1,
				pin: true,
			},
		});

		tl.to(root.querySelectorAll('#outerTop, #outerBottom, #outerLeft, #outerRight'), {
			strokeDashoffset: 0,
			duration: 1,
			ease: 'none',
		})
			.to(
				root.querySelectorAll('#frontLeft, #frontRight, #frontFloorL, #frontFloorR'),
				{ strokeDashoffset: 0, duration: 1, ease: 'none' },
				'<0.2'
			)
			.to(root.querySelector('#backRect'), { strokeDashoffset: 0, duration: 1, ease: 'none' }, '<0.3')
			.to(
				root.querySelectorAll('#grid path'),
				{ strokeDashoffset: 0, duration: 1, ease: 'none', stagger: 0.08 },
				'<0.2'
			)
			.to(
				root.querySelectorAll('#dimW path, #dimH path, #dimD path'),
				{ strokeDashoffset: 0, duration: 0.8, ease: 'none', stagger: 0.1 },
				'<'
			)
			.to(labels, { opacity: 1, duration: 0.6 }, '<0.2')
			.to(numbers, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }, '<0.3');

		const unsubscribe = onScrollFrame(() => ScrollTrigger.update());

		return () => {
			unsubscribe();
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	}, []);

	return (
		<div ref={stageRef} className={cx('stage')}>
			<svg
				className={cx('svg')}
				viewBox="0 0 1600 640"
				xmlns="http://www.w3.org/2000/svg"
				role="img"
				aria-label="Diagrama del foro: 8m x 6m, 4m de altura, fondo infinito de 192 m³"
			>
				{/* outer frame (front wall opening) */}
				<path id="frontLeft" className={cx('line')} d="M 370 120 L 30 10" />
				<path id="frontRight" className={cx('line')} d="M 1230 120 L 1570 10" />
				<path id="frontFloorL" className={cx('line')} d="M 370 480 L 20 600" />
				<path id="frontFloorR" className={cx('line')} d="M 1230 480 L 1580 600" />

				{/* back rectangle (the infinity backdrop) */}
				<rect id="backRect" className={cx('line')} x="370" y="120" width="860" height="360" />

				{/* outer rectangle */}
				<path id="outerTop" className={cx('thin')} d="M 30 10 L 1570 10" />
				<path id="outerBottom" className={cx('thin')} d="M 20 600 L 1580 600" />
				<path id="outerLeft" className={cx('thin')} d="M 30 10 L 20 600" />
				<path id="outerRight" className={cx('thin')} d="M 1570 10 L 1580 600" />

				{/* ceiling perspective grid */}
				<g id="grid" className={cx('thin')}>
					<path d="M 550 120 L 300 10" />
					<path d="M 730 120 L 570 10" />
					<path d="M 910 120 L 840 10" />
					<path d="M 1090 120 L 1110 10" />
					<path d="M 1270 120 L 1380 10" />
					<path d="M 400 60 L 1450 60" />
					<path d="M 420 90 L 1400 90" />
				</g>

				{/* dimension lines */}
				<g id="dimW" className={cx('dim')}>
					<path d="M 20 630 L 1580 630" />
					<path d="M 20 620 L 20 640" />
					<path d="M 1580 620 L 1580 640" />
				</g>
				<text className={cx('dimlabel')} x="780" y="622" textAnchor="middle">
					8m
				</text>

				<g id="dimH" className={cx('dim')}>
					<path d="M 1610 10 L 1610 600" />
					<path d="M 1600 10 L 1620 10" />
					<path d="M 1600 600 L 1620 600" />
				</g>
				<text className={cx('dimlabel')} x="1560" y="300" textAnchor="middle">
					4m
				</text>

				<g id="dimD" className={cx('dim')}>
					<path d="M 0 130 L 0 470" />
					<path d="M -10 130 L 10 130" />
					<path d="M -10 470 L 10 470" />
				</g>
				<text className={cx('dimlabel')} x="60" y="305" textAnchor="middle">
					6m
				</text>

				{/* headline numbers */}
				<g id="numbers" transform="translate(1160,330)">
					<text className={cx('bignum')} textAnchor="end" x="0" y="0">
						192
						<tspan className={cx('exp')} dy="-55">
							3
						</tspan>
					</text>
					<text className={cx('bignum')} textAnchor="end" x="0" y="120">
						M
					</text>
					<text className={cx('brand')} textAnchor="end" x="-215" y="70">
						FONDO
						<tspan x="-215" dy="24">
							INFINITO
						</tspan>
					</text>
				</g>
			</svg>
		</div>
	);
}
