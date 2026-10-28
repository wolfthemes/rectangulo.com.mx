// Credit fields shown in the project viewer / WORK popup (WORK p.7-8), in
// display order. Keys are WP custom field names (work.workCredits), except
// `client` which also falls back on workClient. Empty ones are hidden by
// ProjectViewer; custom fields not listed here are appended with their key.
export const CREDIT_FIELDS = [
	['client', { es: 'Cliente', en: 'Client' }],
	['agency', { es: 'Agencia', en: 'Agency' }],
	['artist', { es: 'Artista / Marca', en: 'Artist / Brand' }],
	['director', { es: 'Director', en: 'Director' }],
	['producer', { es: 'Productor', en: 'Producer' }],
	['dop', { es: 'Dir. de fotografía', en: 'DOP' }],
	['editor', { es: 'Editor', en: 'Editor' }],
	['colorist', { es: 'Colorista', en: 'Colorist' }],
	['sound', { es: 'Sonido', en: 'Sound' }],
	['vfx', 'VFX'],
	['production', { es: 'Producción', en: 'Production' }],
	['post', { es: 'Postproducción', en: 'Post' }],
	['location', { es: 'Locación', en: 'Location' }],
];
