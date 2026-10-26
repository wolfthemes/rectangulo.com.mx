import { useT } from '../lib/i18n';
import { LegalPage } from '../components';

export default function CookiesPage() {
	const t = useT();
	return <LegalPage title={t({ es: 'Política de cookies', en: 'Cookie Policy' })} />;
}
