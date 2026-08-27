import { gql, useQuery } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { Header, Footer, Main, SEO, NavigationMenu, VideoGrid } from '../components';

// Same Next.js-first pattern as pages/portfolio.js — chrome and `videos`
// are separate queries so a GraphQL error on one doesn't fail the whole
// combined response and take the nav down with it.
export default function VideosPage() {
	const { data } = useQuery(VideosPage.query, {
		variables: VideosPage.variables(),
	});
	const { data: videosData, loading: videosLoading } = useQuery(VideosPage.videosQuery, {
		errorPolicy: 'all',
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};
	const primaryMenu = data?.headerMenuItems?.nodes ?? [];
	const footerMenu = data?.footerMenuItems?.nodes ?? [];
	// null while loading (or erroring) so VideoGrid can tell "not resolved
	// yet" apart from "resolved, genuinely empty" — see PortfolioGrid for the
	// same distinction.
	const videos = videosLoading
		? null
		: (videosData?.videos?.edges?.map(({ node }) => ({
				title: node.title,
				image: node.featuredImage?.node?.sourceUrl,
				preview: node.videoPreviewUrl,
				full: node.videoFullUrl,
			})) ?? []);

	return (
		<>
			<SEO title={`Motion — ${siteTitle ?? 'Rectángulo'}`} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<VideoGrid videos={videos} />
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

VideosPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetVideosPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

// first: 20 — simple page-load list, no pagination UI yet, same as `works`.
VideosPage.videosQuery = gql`
	query GetVideos {
		videos(first: 20) {
			edges {
				node {
					title
					videoPreviewUrl
					videoFullUrl
					featuredImage {
						node {
							sourceUrl
							altText
						}
					}
				}
			}
		}
	}
`;

VideosPage.variables = () => ({
	headerLocation: MENUS.PRIMARY_LOCATION,
	footerLocation: MENUS.FOOTER_LOCATION,
});
