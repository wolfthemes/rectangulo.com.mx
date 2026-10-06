import { useState } from 'react';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import styles from './ServicesTeam.module.scss';

let cx = classNames.bind(styles);

// ponytail: brief section 05 — names and titles only; bios/photos/final
// titles are pending institutional copy per the brief itself ("Role to be
// defined" / "final title to be defined"). No portrait images yet, so the
// active panel shows initials instead of a fabricated photo.
const TEAM = [
	{ name: 'Josh Sándre', role: 'Director / Creative' },
	{ name: 'Román Hernández', role: 'Producer' },
	{ name: 'Karla Suárez', role: 'Role to be defined' },
];

function initials(name) {
	return name.split(' ').map((part) => part[0]).join('');
}

export default function ServicesTeam() {
	const [activeIndex, setActiveIndex] = useState(0);
	const active = TEAM[activeIndex];

	return (
		<section className={cx('component')}>
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
				</div>
			</Container>
		</section>
	);
}
