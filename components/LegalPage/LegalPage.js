import { gql, useQuery } from '@apollo/client';
import classNames from 'classnames/bind';
import * as MENUS from '../../constants/menus';
import { BlogInfoFragment } from '../../fragments/GeneralSettings';
import { Header, Footer, Main, SEO, Container, Heading } from '../../components';
// Imported directly, not through the barrel above: LegalPage is itself
// barrel-exported (components/index.js), and LegalPage.query reads
// NavigationMenu.fragments.entry at module top level — going through the
// barrel hits it mid-circular-evaluation (NavigationMenu's barrel export
// comes after LegalPage's alphabetically, so it's still undefined at that
// point). Header/Footer get away with importing NavigationMenu from the
// barrel because they only reference it inside render, not at module scope.
import { NavigationMenu } from '../NavigationMenu';
import { useT } from '../../lib/i18n';
import styles from './LegalPage.module.scss';

let cx = classNames.bind(styles);

// Shared shell for /privacy and /cookies (HOME brief p.10: legal links in the
// footer). Body copy is the client's to supply — never invent legal text.
export default function LegalPage({ title, children }) {
	const t = useT();
	const { data } = useQuery(LegalPage.query, {
		variables: { headerLocation: MENUS.PRIMARY_LOCATION, footerLocation: MENUS.FOOTER_LOCATION },
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};

	return (
		<>
			<SEO title={`${title} — ${siteTitle ?? 'Rectángulo'}`} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={data?.headerMenuItems?.nodes ?? []} />
			<Main>
				<Container>
					<div className={cx('component')}>
						<Heading level="h1" className={cx('heading')}>
							{title}
						</Heading>
						{children ?? (
								<p>{t({ es: '[POR PROPORCIONAR: texto legal', en: '[TO BE PROVIDED: legal text' })} — {title}]</p>
							)}
					</div>
				</Container>
			</Main>
			<Footer title={siteTitle} menuItems={data?.footerMenuItems?.nodes ?? []} />
		</>
	);
}

LegalPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetLegalPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
		generalSettings {
			...BlogInfoFragment
		}
		headerMenuItems: menuItems(where: { location: $headerLocation }) {
			nodes {
				...NavigationMenuItemFragment
			}
		}
		footerMenuItems: menuItems(where: { location: $footerLocation }) {
			nodes {
				...NavigationMenuItemFragment
			}
		}
	}
`;
