import { gql, useQuery } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import {
	Header,
	Footer,
	Main,
	SEO,
	NavigationMenu,
	ClientLogosCarousel,
	ServicesCapabilities,
	ServicesStage,
	ServicesTeam,
	ServicesCTA,
} from '../components';

// ponytail: same Next.js-first pattern as pages/about.js and pages/contact.js
// — Header/Footer pull real WP menu/site data, everything else is hardcoded
// institutional content from the SERVICES brief until a WP source exists for
// it. The brief's red/noise HOME->SERVICES transition and the clients
// carousel's hover/tap BTS collage aren't built yet — see the component-level
// ponytail notes for what's deferred where.
export default function ServicesPage() {
	const { data } = useQuery(ServicesPage.query, {
		variables: ServicesPage.variables(),
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};
	const primaryMenu = data?.headerMenuItems?.nodes ?? [];
	const footerMenu = data?.footerMenuItems?.nodes ?? [];

	return (
		<>
			<SEO title={`Services — ${siteTitle ?? 'Rectángulo'}`} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<ClientLogosCarousel />
				<ServicesCapabilities />
				<ServicesStage />
				<ServicesTeam />
				<ServicesCTA />
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

ServicesPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetServicesPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

ServicesPage.variables = () => ({
	headerLocation: MENUS.PRIMARY_LOCATION,
	footerLocation: MENUS.FOOTER_LOCATION,
});
