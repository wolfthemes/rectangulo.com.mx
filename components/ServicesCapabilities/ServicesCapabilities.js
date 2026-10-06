import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './ServicesCapabilities.module.scss';

let cx = classNames.bind(styles);

// ponytail: brief section 03 — one service per scroll-driven visual loop.
// This scaffold stacks the six sections as plain static blocks (no loop
// video, no scroll-triggered transition between them yet); swap each
// `.loop` placeholder for a real autoplay clip and wire scroll pinning once
// footage exists — same gap as WORK's filmstrip and HOME's hero.
const SERVICES = [
	{
		number: '03.1',
		title: 'Pre-production',
		description: 'Development of each project from the initial idea into a creative, technical and executable production plan.',
		capabilities: [
			'Creative Development', 'Creative Treatment', 'Concept Development', 'Research',
			'Script Development', 'Storyboards', 'Moodboards', 'Previsualization',
			'Production Planning', 'Budgeting', 'Scheduling', 'Casting',
			'Location Scouting', 'Crew Planning', 'Technical Planning',
		],
	},
	{
		number: '03.2',
		title: 'Production',
		description: 'End-to-end audiovisual production, from compact crews to larger-scale productions.',
		capabilities: [
			'Commercials', 'Advertising', 'Branded Content', 'Music Videos', 'Digital Content',
			'Corporate Content', 'Films', 'Series', 'Documentary', 'Interviews',
			'Product Films', 'Social Content', 'Multi-camera Production',
		],
	},
	{
		number: '03.3',
		title: 'Post-production',
		description: 'Post-production workflows that take material from the edit through final mastering and delivery.',
		capabilities: [
			'Editing', 'Offline / Online Editing', 'Color Correction', 'Color Grading',
			'Sound Editing', 'Sound Design', 'Mixing', 'Motion Graphics', 'Titles',
			'Graphics', 'Mastering', 'Deliverables / Adaptations',
		],
	},
	{
		number: '03.4',
		title: 'Events & Live Production',
		description: 'Audiovisual design, production and technical operation for events, congresses, activations and live experiences.',
		capabilities: [
			'Event Production', 'Mass Events', 'Live Streaming', 'CCTV', 'Multi-camera Production',
			'PTZ Systems', 'LED Screens', 'Giant LED Displays', 'Stage Design', 'Visual Content',
			'Show Content', 'Technical Direction', 'Event Photo & Video', 'Brand Activations',
			'Stands / Booths', 'Event Recaps',
		],
	},
	{
		number: '03.5',
		title: 'Photography',
		description: 'Photography production for campaigns, brands, products, people and editorial content.',
		capabilities: [
			'Advertising', 'Campaigns', 'Product', 'Food', 'Fashion', 'Portrait', 'Corporate',
			'Lifestyle', 'Documentary', 'Event Photography', 'Editorial', 'Behind the Scenes',
			'Production Stills',
		],
	},
	{
		number: '03.6',
		title: 'Equipment Rental',
		description: 'Professional audiovisual equipment available as individual rentals or integrated into a Rectángulo production.',
		capabilities: [
			'Cameras', 'Cinema Cameras', 'Lenses / Optics', 'Lighting', 'Wireless Video',
			'Monitors', 'Camera Support', 'Tripods', 'Gimbals', 'Audio',
			'Production Accessories', 'Video Systems',
		],
		// brief: "Show a curated equipment selection and CTA: VIEW RENTAL
		// EQUIPMENT →" — no dedicated rental catalog page exists yet, so this
		// stays a label instead of a dead link.
		cta: 'View Rental Equipment →',
	},
];

export default function ServicesCapabilities() {
	return (
		<section className={cx('component')}>
			<Container>
				{SERVICES.map(({ number, title, description, capabilities, cta }) => (
					<article key={number} className={cx('service')}>
						<div className={cx('loop')} aria-hidden="true" />
						<div className={cx('info')}>
							<span className={cx('number')}>{number}</span>
							<h3 className={cx('title')}>{title}</h3>
							<p className={cx('description')}>{description}</p>
							<p className={cx('capabilities')}>{capabilities.join(' · ')}</p>
							{cta && <span className={cx('cta')}>{cta}</span>}
						</div>
					</article>
				))}
			</Container>
		</section>
	);
}
