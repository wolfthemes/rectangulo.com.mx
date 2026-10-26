import { useT } from '../lib/i18n';
import { LegalPage } from '../components';

export default function PrivacyPage() {
	const t = useT();
	return <LegalPage title={t({ es: 'Aviso de privacidad', en: 'Privacy Notice' })} />;
}
