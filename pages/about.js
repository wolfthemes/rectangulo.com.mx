import { gql, useQuery } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import {
	Header,
	Footer,
	Main,
	SEO,
	NavigationMenu,
	AboutHero,
	AboutInstalaciones,
	ParallaxSection,
	AboutServices,
	AboutGallery,
	AboutTeam,
	ClientLogosCarousel,
} from '../components';

// ponytail: Next.js-first build. Header/Footer pull real WP menu/site data
// (same query shape as wp-templates/page.js) since that's live and unrelated
// to this page's own content; the About sections below are hardcoded
// placeholders until the design settles and we decide how WP feeds them —
// see docs/superpowers/specs plan "About page: Next.js-first build".
export default function AboutPage() {
	const { data } = useQuery(AboutPage.query, {
		variables: AboutPage.variables(),
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};
	const primaryMenu = data?.headerMenuItems?.nodes ?? [];
	const footerMenu = data?.footerMenuItems?.nodes ?? [];

	return (
		<>
			<SEO title={`About — ${siteTitle ?? 'Rectángulo'}`} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<AboutHero />
				<AboutInstalaciones />
				<ParallaxSection />
				<AboutServices />
				<AboutGallery />
				<AboutTeam />
				{/* Two-property wrapper — not worth its own component/module file
				    just to continue AboutTeam's red band under the logo strip. */}
				<section
					style={{ background: 'var(--wpe--color--accent)', padding: 'var(--wpe--section--padding-y) 0' }}
				>
					<ClientLogosCarousel />
				</section>
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

AboutPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetAboutPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

AboutPage.variables = () => ({
	headerLocation: MENUS.PRIMARY_LOCATION,
	footerLocation: MENUS.FOOTER_LOCATION,
});
