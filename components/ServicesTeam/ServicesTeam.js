import { useState } from 'react';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { useT } from '../../lib/i18n';
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
		role: { es: 'Director / Creativo', en: 'Director / Creative' },
		bio: {
			es: 'Lidera la dirección creativa de principio a fin, desde el primer concepto hasta el corte final, manteniendo cada producción anclada a una idea visual clara.',
			en: 'Leads creative direction end to end, from first concept to final cut, keeping every production anchored to a clear visual idea.',
		},
	},
	{
		name: 'Román Hernández',
		role: { es: 'Productor', en: 'Producer' },
		bio: {
			es: 'Dirige la producción en campo — calendario, equipo, presupuesto — para que el equipo creativo se concentre en lo que ocurre frente a cámara.',
			en: 'Runs production on the ground — scheduling, crew, budget — so the creative team can focus on the work in front of the camera.',
		},
	},
	{
		name: 'Karla Suárez',
		role: { es: 'Puesto por definir', en: 'Role to be defined' },
		bio: {
			es: 'Parte del equipo de Rectángulo, biografía por definir.',
			en: 'Part of the Rectángulo team, bio to be defined.',
		},
	},
];

function initials(name) {
	return name.split(' ').map((part) => part[0]).join('');
}

export default function ServicesTeam() {
	const t = useT();
	const [activeIndex, setActiveIndex] = useState(0);
	const active = TEAM[activeIndex];

	return (
		<section className={`${cx('component')} grain`}>
			<Container>
				<h2 className={cx('heading')}>{t({ es: 'Nuestra gente', en: 'Our People' })}</h2>

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
									<span className={cx('role')}>{t(role)}</span>
								</button>
							</li>
						))}
					</ul>

					<div className={cx('portrait')} aria-hidden="true">
						<span className={cx('initials')}>{initials(active.name)}</span>
					</div>
					<p className={cx('bio')}>{t(active.bio)}</p>
				</div>
			</Container>
		</section>
	);
}
