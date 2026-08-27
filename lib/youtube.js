// Matches youtube.com/watch?v=, youtu.be/, and already-embed URLs — returns
// the video id, or null for a self-hosted file URL. Shared by VideoGrid's
// lightbox and single-video's inline player.
export function youtubeId(url) {
	const match = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/.exec(url ?? '');
	return match ? match[1] : null;
}
