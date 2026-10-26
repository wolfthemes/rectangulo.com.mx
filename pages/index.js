import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { HERO_DEMOREEL_URL, SHOWREEL_URL } from '../constants/media';
import * as MENUS from '../constants/menus';
import { useT } from '../lib/i18n';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import {
	Header,
	Footer,
	Main,
	SEO,
	NavigationMenu,
	HomeHero,
	HomeExplore,
	HomeFeaturedWork,
	HomeCTA,
	VideoModal,
} from '../components';

// ponytail: scaffold stage — mirrors pages/portfolio.js's Next.js-first
// pattern (chrome query separate from content query, so a `works` error
// never takes the nav down with it). No demoreel file or final statement
// copy from the client yet; HomeHero already renders fine without a
// demoreelUrl (falls back to a dark placeholder). Swap in real copy/video
// once the client provides them — see the HOME brief in the project KB.
const STATEMENT = {
	es: 'Somos una productora audiovisual especializada en contenido comercial, branded content y narrativa.',
	en: 'We are an audiovisual production company specialized in commercial content, branded content and narrative.',
};

export default function HomePage() {
	const t = useT();
	const [showreelOpen, setShowreelOpen] = useState(false);
	const { data } = useQuery(HomePage.query, {
		variables: HomePage.variables(),
	});
	const { data: worksData, loading: worksLoading } = useQuery(HomePage.worksQuery, {
		errorPolicy: 'all',
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};
	const primaryMenu = data?.headerMenuItems?.nodes ?? [];
	const footerMenu = data?.footerMenuItems?.nodes ?? [];
	const works = worksLoading ? null : (worksData?.works?.edges?.map((edge) => edge.node) ?? []);

	return (
		<>
			<SEO title={siteTitle} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} hidden />
			<Main>
				<HomeHero
				demoreelUrl={HERO_DEMOREEL_URL}
				statement={t(STATEMENT)}
				onViewShowreel={() => setShowreelOpen(true)}
			/>
				<HomeExplore />
				<HomeFeaturedWork works={works} />
				<HomeCTA />
			</Main>
			<VideoModal open={showreelOpen} onClose={() => setShowreelOpen(false)} src={SHOWREEL_URL} title="Showreel" />
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

HomePage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetHomePageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

// first: 5 — Featured Work is a curated slice (brief section 05), not the
// full archive (that's /portfolio). No orderby yet; add one (e.g. a
// "featured" flag/menu_order) once there are enough posts for curation to
// matter — right now it's just the 9 seed posts.
HomePage.worksQuery = gql`
	${HomeFeaturedWork.fragments.entry}
	query GetFeaturedWorks {
		works(first: 5) {
			edges {
				node {
					featuredImage {
						node {
							sourceUrl
							altText
						}
					}
					...HomeFeaturedWorkFragment
				}
			}
		}
	}
`;

HomePage.variables = () => ({
	headerLocation: MENUS.PRIMARY_LOCATION,
	footerLocation: MENUS.FOOTER_LOCATION,
});
