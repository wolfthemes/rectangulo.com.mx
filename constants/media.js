import { SITE_URL } from '../lib/seo/site';

// Distinguishes a direct video file (self-hosted mp4/webm/…) from an embed
// link (YouTube/Vimeo/…) — a file can be dropped into a plain <video>, an
// embed needs an <iframe>. Shared by anything rendering a work's video meta.
export const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

// Hero background loop (HOME p.3).
export const HERO_DEMOREEL_URL = '/videos/hero.mp4';

// Showreel modal (HOME p.4). Must be an absolute http(s) URL — VideoModal's
// getSafeHttpUrl rejects a bare relative path like HERO_DEMOREEL_URL. The
// file lives in this repo's own public/videos, served by the frontend
// (SITE_URL), not by WP — it was wrongly hardcoded to the backend domain.
export const SHOWREEL_URL = `${SITE_URL}${HERO_DEMOREEL_URL}`;
