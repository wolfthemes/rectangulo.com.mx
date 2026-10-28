import classNames from 'classnames/bind';
import styles from './DrawButton.module.scss';

let cx = classNames.bind(styles);

// Outlined button with an SVG border that draws itself on hover and reverses
// on mouse-out. pathLength="1" keeps the dash math size-independent, so no JS
// measuring. Extra props (onClick, disabled, type, ...) go to the <button>.
export default function DrawButton({ children, className, ...props }) {
	return (
		<button type="button" className={cx('component', className)} {...props}>
			{children}
			<svg className={cx('svg')} aria-hidden="true">
				<rect className={cx('shape')} width="100%" height="100%" pathLength="1" />
			</svg>
		</button>
	);
}
