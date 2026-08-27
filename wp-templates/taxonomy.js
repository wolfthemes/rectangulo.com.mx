import { gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { Header, Footer, Main, EntryHeader, NavigationMenu, PortfolioGrid, VideoGrid, SEO } from '../components';

// ponytail: generic fallback for the custom `work` taxonomies (WorkType,
// WorkService) and the `video_type` taxonomy (VideoType) — Category/Tag keep
// their own dedicated templates, so this only ever matches those. Same card
// grid as pages/portfolio.js / pages/videos.js so a term archive looks like
// its post type's main archive. Which grid renders depends on which edge the
// query resolved (`works` vs `videos`) — a term is only ever one or the other.
export default function Component(props) {
	const { title: siteTitle, description: siteDescription } = props?.data?.generalSettings ?? {};
	const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
	const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
	const term = props.data.nodeByUri;
	const { name } = term ?? {};
	const works = term?.works ? (term.works.edges?.map((edge) => edge.node) ?? []) : null;
	const videos = term?.videos
		? (term.videos.edges?.map(({ node }) => ({
				title: node.title,
				image: node.featuredImage?.node?.sourceUrl,
				preview: node.videoPreviewUrl,
				full: node.videoFullUrl,
			})) ?? [])
		: null;

	return (
		<>
			<SEO title={name ? `${name} — ${siteTitle}` : siteTitle} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<EntryHeader title={name} />
				{videos ? <VideoGrid videos={videos} /> : <PortfolioGrid works={works ?? []} />}
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

Component.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetTaxonomyPage(
		$uri: String!
		$headerLocation: MenuLocationEnum
		$footerLocation: MenuLocationEnum
	) {
		nodeByUri(uri: $uri) {
			... on WorkService {
				name
				works {
					edges {
						node {
							title
							excerpt
							slug
							workYear
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
			... on WorkType {
				name
				works {
					edges {
						node {
							title
							excerpt
							slug
							workYear
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
			... on VideoType {
				name
				videos {
					edges {
						node {
							title
							slug
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
		}
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

Component.variables = ({ uri }) => {
	return {
		uri,
		headerLocation: MENUS.PRIMARY_LOCATION,
		footerLocation: MENUS.FOOTER_LOCATION,
	};
};
