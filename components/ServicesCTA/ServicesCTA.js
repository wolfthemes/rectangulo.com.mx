import Link from 'next/link';
import classNames from 'classnames/bind';
import { Container } from '../Container';
import { useT } from '../../lib/i18n';
import styles from './ServicesCTA.module.scss';

let cx = classNames.bind(styles);

// Brief section 06 — contact/social/legal already live in Footer, rendered
// right after this (same split as HomeCTA on the HOME page). Props let the
// WORK page (brief p.10) reuse it with its own wording.
export default function ServicesCTA({
	heading,
	body,
	label,
}) {
	const t = useT();
	// Defaults live here (not in the param list) so they can follow the locale.
	heading ??= t({ es: 'Trabajemos juntos', en: 'Let\u2019s Work Together' });
	body ??= t({
		es: 'Una breve invitación para platicar sobre una producción, un servicio o un requerimiento técnico.',
		en: 'Short invitation to discuss a production, service or technical requirement.',
	});
	label ??= t({ es: 'Iniciar un proyecto', en: 'Start a Project' });
	return (
		<section className={cx('component')}>
			<Container>
				<h2 className={cx('heading')}>{heading}</h2>
				<p className={cx('body')}>{body}</p>
				<Link href="/contact" className={`${cx('link')} link-underline`}>
					{label} <span aria-hidden="true">→</span>
				</Link>
			</Container>
		</section>
	);
}
