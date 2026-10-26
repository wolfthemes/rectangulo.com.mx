import { LegalPage } from '../components';
import { useT } from '../lib/i18n';

// ponytail: same placeholder shell as pages/projects.js — the real catalog
// (SERVICES brief p.7) needs the client's equipment inventory.
export default function RentalPage() {
	const t = useT();
	return (
		<LegalPage title={t({ es: 'Renta de equipo', en: 'Equipment Rental' })}>
			<p>
				{t({
					es: '[POR PROPORCIONAR: inventario del equipo en renta (categorías, modelos, fotos)]',
					en: '[TO BE PROVIDED: rental equipment inventory (categories, models, photos)]',
				})}
			</p>
		</LegalPage>
	);
}
