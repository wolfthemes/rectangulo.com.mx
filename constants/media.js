// Distinguishes a direct video file (self-hosted mp4/webm/…) from an embed
// link (YouTube/Vimeo/…) — a file can be dropped into a plain <video>, an
// embed needs an <iframe>. Shared by anything rendering a work's video meta.
export const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

// Hero background loop (HOME p.3).
export const HERO_DEMOREEL_URL = '/videos/hero.mp4';

// Showreel modal (HOME p.4). Same file, same relative path — getSafeHttpUrl
// now accepts a same-origin relative path directly, so this always loads
// from whatever origin is serving the page (localhost, preview, prod)
// instead of being hardcoded to one specific domain.
export const SHOWREEL_URL = HERO_DEMOREEL_URL;
