import classNames from 'classnames/bind';
import * as SELECTORS from '../../constants/selectors';
import { useT } from '../../lib/i18n';
import styles from './SkipNavigationLink.module.scss';

let cx = classNames.bind(styles);

export default function SkipNavigationLink() {
	const t = useT();
	return (
		<a className={cx(['component', 'sr-only'])} href={`#${SELECTORS.MAIN_CONTENT_ID}`}>
			{t({ es: 'Saltar al contenido principal', en: 'Skip To Main Content' })}
		</a>
	);
}
