import { gql, useQuery } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { useT } from '../lib/i18n';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { Header, Footer, Main, SEO, NavigationMenu, PortfolioGrid, WorkItemMedia } from '../components';

// Project Archives: the full `work` CPT archive (the page assigned as
// portfolio_page_id on the backend) — every post, grid layout, no curation
// or cap. pages/projects.js ("Projects") is the curated carousel that links
// here via "View all projects".
export default function WorkArchivesPage() {
	const t = useT();
	const { data } = useQuery(WorkArchivesPage.query, {
		variables: WorkArchivesPage.variables(),
	});
	const { data: worksData, loading: worksLoading } = useQuery(WorkArchivesPage.worksQuery, {
		errorPolicy: 'all',
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};
	const primaryMenu = data?.headerMenuItems?.nodes ?? [];
	const footerMenu = data?.footerMenuItems?.nodes ?? [];
	// null while loading (or erroring) so PortfolioGrid can tell "not
	// resolved yet" apart from "resolved, genuinely empty" — see its own
	// comment on why that distinction matters for the placeholder fallback.
	const works = worksLoading ? null : (worksData?.works?.edges?.map((edge) => edge.node) ?? []);

	return (
		<>
			<SEO title={t({ es: 'Archivo de proyectos', en: 'Project Archives' })} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<PortfolioGrid works={works} />
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

WorkArchivesPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetWorkArchivesPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

// first: 100 — WPGraphQL's page cap, same as sitemap.xml.js; paginate past
// 100 works once there are that many.
WorkArchivesPage.worksQuery = gql`
	${WorkItemMedia.fragments.entry}
	query GetAllWorks {
		works(first: 100) {
			edges {
				node {
					title
					excerpt
					slug
					workYear
					date
					workTypes {
						nodes {
							name
						}
					}
					featuredImage {
						node {
							sourceUrl
							altText
						}
					}
					...WorkMediaFragment
				}
			}
		}
	}
`;

WorkArchivesPage.variables = () => ({
	headerLocation: MENUS.PRIMARY_LOCATION,
	footerLocation: MENUS.FOOTER_LOCATION,
});
