import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import classNames from 'classnames/bind';
import * as MENUS from '../constants/menus';
import { useT } from '../lib/i18n';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { Header, Footer, Main, SEO, NavigationMenu, ServicesCTA, WorkFilmstrip, WorkItemMedia } from '../components';
import styles from './projects.module.scss';

let cx = classNames.bind(styles);

// ponytail: same Next.js-first pattern as pages/about.js and pages/contact.js
// — Header/Footer pull real WP menu/site data. `works` is its own query, kept
// separate from the chrome query on purpose: a GraphQL error on one field
// fails the whole combined response (Apollo returns no data at all), which
// previously took the nav down with it whenever the CPT wasn't queryable yet.
// This is the curated "Projects" page (carousel, capped at 7 by WorkFilmstrip
// itself); /project-archives is the full grid of every work post.
export default function ProjectsPage() {
	const t = useT();
	const { data } = useQuery(ProjectsPage.query, {
		variables: ProjectsPage.variables(),
	});
	const { data: worksData, loading: worksLoading } = useQuery(ProjectsPage.worksQuery, {
		errorPolicy: 'all',
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};
	const primaryMenu = data?.headerMenuItems?.nodes ?? [];
	const footerMenu = data?.footerMenuItems?.nodes ?? [];
	const works = worksLoading ? null : (worksData?.works?.edges?.map((edge) => edge.node) ?? []);

	return (
		<>
			<SEO title={t({ es: 'Proyectos', en: 'Projects' })} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<WorkFilmstrip works={works ?? []} />
				<Link href="/project-archives" className={`${cx('viewAll')} link-underline`}>
					{t({ es: 'Ver todos los proyectos', en: 'View all projects' })} <span aria-hidden="true">→</span>
				</Link>
				<ServicesCTA
					heading={t({ es: '¿Tienes un proyecto en mente?', en: 'Have a project in mind?' })}
					body={t({ es: 'Hagamos algo juntos.', en: 'Let’s make something together.' })}
				/>
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

ProjectsPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetProjectsPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

// first: 20 — a simple page-load list, no pagination UI yet — bump/paginate
// once there are enough real posts for it to matter.
ProjectsPage.worksQuery = gql`
	${WorkItemMedia.fragments.entry}
	query GetWorks {
		works(first: 20) {
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

ProjectsPage.variables = () => ({
	headerLocation: MENUS.PRIMARY_LOCATION,
	footerLocation: MENUS.FOOTER_LOCATION,
});
