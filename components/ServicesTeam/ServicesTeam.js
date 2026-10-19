import { useState } from 'react';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './ServicesTeam.module.scss';

let cx = classNames.bind(styles);

// ponytail: brief section 05 — names and titles only; final titles and real
// bios are pending institutional copy per the brief itself ("Role to be
// defined"). Bios below are placeholder copy, not real bios. No portrait
// images yet, so the active panel shows initials instead of a fabricated
// photo.
const TEAM = [
	{
		name: 'Josh Sándre',
		role: 'Director / Creative',
		bio: 'Leads creative direction end to end, from first concept to final cut, keeping every production anchored to a clear visual idea.',
	},
	{
		name: 'Román Hernández',
		role: 'Producer',
		bio: 'Runs production on the ground — scheduling, crew, budget — so the creative team can focus on the work in front of the camera.',
	},
	{
		name: 'Karla Suárez',
		role: 'Role to be defined',
		bio: 'Part of the Rectángulo team, bio to be defined.',
	},
];

function initials(name) {
	return name.split(' ').map((part) => part[0]).join('');
}

export default function ServicesTeam() {
	const [activeIndex, setActiveIndex] = useState(0);
	const active = TEAM[activeIndex];

	return (
		<section className={`${cx('component')} grain`}>
			<Container>
				<h2 className={cx('heading')}>Our People</h2>

				<div className={cx('layout')}>
					<ul className={cx('names')}>
						{TEAM.map(({ name, role }, i) => (
							<li key={name}>
								<button
									type="button"
									className={cx('name', { active: i === activeIndex })}
									onMouseEnter={() => setActiveIndex(i)}
									onFocus={() => setActiveIndex(i)}
									onClick={() => setActiveIndex(i)}
								>
									{name}
									<span className={cx('role')}>{role}</span>
								</button>
							</li>
						))}
					</ul>

					<div className={cx('portrait')} aria-hidden="true">
						<span className={cx('initials')}>{initials(active.name)}</span>
					</div>
					<p className={cx('bio')}>{active.bio}</p>
				</div>
			</Container>
		</section>
	);
}
