import { gql, useQuery } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { Header, Footer, Main, SEO, NavigationMenu, ContactHero } from '../components';

// ponytail: same Next.js-first pattern as pages/about.js — Header/Footer
// pull real WP menu/site data, ContactHero is a hardcoded placeholder from
// the "Trabajemos Juntos" dossier slide until a WP source exists for it.
export default function ContactPage() {
	const { data } = useQuery(ContactPage.query, {
		variables: ContactPage.variables(),
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};
	const primaryMenu = data?.headerMenuItems?.nodes ?? [];
	const footerMenu = data?.footerMenuItems?.nodes ?? [];

	return (
		<>
			<SEO title={`Contact — ${siteTitle ?? 'Rectángulo'}`} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<ContactHero />
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

ContactPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetContactPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

ContactPage.variables = () => ({
	headerLocation: MENUS.PRIMARY_LOCATION,
	footerLocation: MENUS.FOOTER_LOCATION,
});
