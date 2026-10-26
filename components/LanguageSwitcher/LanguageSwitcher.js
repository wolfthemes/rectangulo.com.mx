import { Fragment } from 'react';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LOCALES, useT } from '../../lib/i18n';
import styles from './LanguageSwitcher.module.scss';

let cx = classNames.bind(styles);

// ES | EN toggle. Records the choice in NEXT_LOCALE so the geo redirect
// (proxy.js) never overrides it. data-no-transition: PageTransition's capture-phase
// click interceptor would swallow onClick, and a same-page language swap needs no curtain.
// Links to the same page in the other locale (asPath is locale-less); the
// active one is marked, not clickable-looking.
export default function LanguageSwitcher({ className }) {
	const { asPath, locale } = useRouter();
	const t = useT();

	return (
		<div className={cx(['component', className])} role="group" aria-label={t({ es: 'Idioma', en: 'Language' })}>
			{LOCALES.map((code, i) => (
				<Fragment key={code}>
					{i > 0 && <span className={cx('divider')} aria-hidden="true">|</span>}
					<Link
						href={asPath}
						locale={code}
						scroll={false}
						data-no-transition
						onClick={() => {
							document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
						}}
						lang={code}
						hrefLang={code}
						className={cx('link', { active: code === locale })}
						aria-current={code === locale ? 'true' : undefined}
					>
						{code.toUpperCase()}
					</Link>
				</Fragment>
			))}
		</div>
	);
}
