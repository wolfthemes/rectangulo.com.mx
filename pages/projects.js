import { LegalPage } from '../components';
import { useT } from '../lib/i18n';

// ponytail: reuses the LegalPage shell (header/footer + title + body) as a
// placeholder — swap for a real grid once the client lists their own IP.
export default function ProjectsPage() {
	const t = useT();
	return (
		<LegalPage title={t({ es: 'Proyectos', en: 'Projects' })}>
			<p>Aahh! La Brava</p>
			<p>
				{t({
					es: '[POR PROPORCIONAR: lista de proyectos propios de Rectángulo (título, imagen, sinopsis)]',
					en: '[TO BE PROVIDED: list of Rectángulo’s own projects (title, visual, synopsis)]',
				})}
			</p>
		</LegalPage>
	);
}
