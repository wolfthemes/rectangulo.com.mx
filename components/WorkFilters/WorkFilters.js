import classNames from 'classnames/bind';
import { ALL_FILTER } from '../../constants/work-filters';
import { useT } from '../../lib/i18n';
import styles from './WorkFilters.module.scss';

let cx = classNames.bind(styles);

// Unique WorkType taxonomy term names actually present across `works`, in
// first-seen order — the row mirrors whatever terms WordPress actually has
// instead of a hardcoded label list going stale the moment a term is
// renamed or added.
function deriveFilters(works) {
	const names = new Set();
	works.forEach((w) => (w.workTypes?.nodes ?? []).forEach((t) => t.name && names.add(t.name)));
	return [ALL_FILTER, ...names];
}

// Horizontal filter row (WORK p.3). Pure client state — no reload. On narrow
// screens the row scrolls sideways natively, which gives the swipe.
export default function WorkFilters({ active, onChange, works = [] }) {
	const filters = deriveFilters(works);
	const t = useT();

	return (
		<ul className={cx('component')} aria-label={t({ es: 'Filtrar trabajo por categoría', en: 'Filter work by category' })}>
			{filters.map((filter) => (
				<li key={filter}>
					<button
						type="button"
						className={cx('button', { active: filter === active })}
						aria-pressed={filter === active}
						onClick={() => onChange(filter)}
					>
						{filter === ALL_FILTER ? t({ es: 'Todo', en: 'All' }) : filter}
					</button>
				</li>
			))}
		</ul>
	);
}
