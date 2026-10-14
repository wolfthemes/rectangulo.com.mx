import { LegalPage } from '../components';

// ponytail: reuses the LegalPage shell (header/footer + title + body) as a
// placeholder — swap for a real grid once the client lists their own IP.
export default function ProjectsPage() {
	return (
		<LegalPage title="Projects">
			<p>Aahh! La Brava</p>
			<p>[À FOURNIR : liste des projets propres Rectángulo (titre, visuel, synopsis)]</p>
		</LegalPage>
	);
}
