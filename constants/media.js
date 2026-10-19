// Distinguishes a direct video file (self-hosted mp4/webm/…) from an embed
// link (YouTube/Vimeo/…) — a file can be dropped into a plain <video>, an
// embed needs an <iframe>. Shared by anything rendering a work's video meta.
export const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

// [À FOURNIR : URL du showreel complet (mp4 ou embed Vimeo/YouTube)] — HOME p.4
export const SHOWREEL_URL = '';

// Hero background loop (HOME p.3).
export const HERO_DEMOREEL_URL = '/videos/hero.mp4';
