// WORK archive filters (WORK brief p.3). Previously a hardcoded EN label
// list (Commercial, Branded Content, …) — the real WorkType taxonomy terms
// turned out to be in Spanish (Comerciales, Narrativa, …), so every one of
// those labels silently matched nothing. Filters now come from whatever
// WorkType terms the works actually carry (see deriveFilters in WorkFilters.js).
export const ALL_FILTER = 'All';

export function matchesFilter(work, filter) {
	if (filter === ALL_FILTER) return true;
	return (work.workTypes?.nodes ?? []).some((t) => t.name === filter);
}
