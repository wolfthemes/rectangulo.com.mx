// WORK archive filters (WORK brief p.3), in display order. A work matches a
// filter when one of its workTypes names equals the label (case-insensitive) —
// D009: the WP taxonomy terms must be named exactly like these.
export const WORK_FILTERS = [
	'All',
	'Commercial',
	'Branded Content',
	'Film & Narrative',
	'Music',
	'Events',
	'Photography',
];

export function matchesFilter(work, filter) {
	if (filter === WORK_FILTERS[0]) return true;
	return (work.workTypes?.nodes ?? []).some((t) => t.name?.toLowerCase() === filter.toLowerCase());
}
