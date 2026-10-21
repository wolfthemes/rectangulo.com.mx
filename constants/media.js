// Distinguishes a direct video file (self-hosted mp4/webm/…) from an embed
// link (YouTube/Vimeo/…) — a file can be dropped into a plain <video>, an
// embed needs an <iframe>. Shared by anything rendering a work's video meta.
export const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

// Hero background loop (HOME p.3).
export const HERO_DEMOREEL_URL = '/videos/hero.mp4';

// Showreel modal (HOME p.4). Must be an absolute http(s) URL — VideoModal's
// getSafeHttpUrl rejects a bare relative path like HERO_DEMOREEL_URL, which
// left the modal falling through to its "[À FOURNIR : vidéo]" placeholder.
export const SHOWREEL_URL = 'https://rectangulo-backend-staging.saguin.com/videos/hero.mp4';
