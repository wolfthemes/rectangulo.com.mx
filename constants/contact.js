// Single source for contact + social details (briefs: HOME p.10, SERVICES p.10).
// ponytail: hardcoded — no WP options field yet. Handles other than
// Instagram/YouTube are unverified guesses, see BLOCKED.md (T004).
export const CONTACT_EMAIL = 'contacto@rectangulofilms.com';
export const CONTACT_PHONE = '+52 3323881333';
export const WEBSITE = 'rectangulo.com.mx';
export const LOCATION = { es: 'Guadalajara, México', en: 'Guadalajara, Mexico' };

// `short` is the brief's abbreviated system IG / VI / YT / IN.
export const SOCIAL_LINKS = [
	{ short: 'IG', label: 'Instagram', href: 'https://instagram.com/rectangulo' },
	{ short: 'VI', label: 'Vimeo', href: 'https://vimeo.com/rectangulo' },
	{ short: 'YT', label: 'YouTube', href: 'https://youtube.com/@rectangulo' },
	{ short: 'IN', label: 'LinkedIn', href: 'https://linkedin.com/company/rectangulo' },
];
