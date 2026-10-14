import classNames from 'classnames/bind';
import { WORK_FILTERS } from '../../constants/work-filters';
import styles from './WorkFilters.module.scss';

let cx = classNames.bind(styles);

// Horizontal filter row (WORK p.3). Pure client state — no reload. On narrow
// screens the row scrolls sideways natively, which gives the swipe.
export default function WorkFilters({ active, onChange }) {
	return (
		<ul className={cx('component')} aria-label="Filter work by category">
			{WORK_FILTERS.map((filter) => (
				<li key={filter}>
					<button
						type="button"
						className={cx('button', { active: filter === active })}
						aria-pressed={filter === active}
						onClick={() => onChange(filter)}
					>
						{filter}
					</button>
				</li>
			))}
		</ul>
	);
}
