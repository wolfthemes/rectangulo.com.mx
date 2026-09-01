import { gql } from '@apollo/client';
import { useFaustQuery } from '@faustwp/core';
import { Container, Footer, Header, Heading, Main, NavigationMenu, SEO } from '../components';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { FeaturedImage } from '../components/FeaturedImage';
import { youtubeId } from '../lib/youtube';
import { getSafeHttpUrl } from '../utils/urls';
import styles from './single-video.module.scss';

const GET_LAYOUT_QUERY = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetLayout($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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

// Title + featured image + the meta fields the theme exposes
// (register-video-fields.php on the rectangulo-headless-theme repo), plus
// the VideoType taxonomy term. Mirrors single-work.js — this exists so a
// direct/preview URL to a video's own permalink still resolves to something,
// even though the grid (VideoGrid) opens videos in a lightbox instead of
// linking here.
const GET_VIDEO_QUERY = gql`
	${FeaturedImage.fragments.entry}
	query GetVideo($databaseId: ID!, $asPreview: Boolean = false) {
		video(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			videoFullUrl
			videoTypes {
				nodes {
					name
				}
			}
			...FeaturedImageFragment
		}
	}
`;

export default function Component(props) {
	// Hooks must run unconditionally and in a stable order, so they precede
	// the loading early-return. useFaustQuery can return undefined before its
	// data lands in the Apollo cache (e.g. client-side nav/hydration timing),
	// so default to {} to avoid destructuring undefined.
	const { video } = useFaustQuery(GET_VIDEO_QUERY) ?? {};
	const { generalSettings, headerMenuItems, footerMenuItems } =
		useFaustQuery(GET_LAYOUT_QUERY) ?? {};

	if (props.loading) {
		return <>Loading...</>;
	}

	const { title: siteTitle, description: siteDescription } = generalSettings ?? {};
	const primaryMenu = headerMenuItems?.nodes ?? [];
	const footerMenu = footerMenuItems?.nodes ?? [];
	const { title, featuredImage, videoFullUrl, videoTypes } = video ?? {};
	const ytId = youtubeId(videoFullUrl);
	const safeVideoFullUrl = getSafeHttpUrl(videoFullUrl);
	const type = videoTypes?.nodes?.map((node) => node.name).join(', ');

	return (
		<>
			<SEO
				title={title ? `${title} — ${siteTitle}` : siteTitle}
				description={siteDescription}
				imageUrl={featuredImage?.node?.sourceUrl}
			/>
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<Container>
					<Heading level="h1" className={styles.title}>
						{title}
					</Heading>
					{type && <p className={styles.type}>{type}</p>}
					{videoFullUrl &&
						(ytId ? (
							<iframe
								className={styles.player}
								src={`https://www.youtube.com/embed/${ytId}`}
								title={title}
								allow="autoplay; encrypted-media; picture-in-picture"
								allowFullScreen
							/>
						) : (
							<video
								className={styles.player}
								src={safeVideoFullUrl}
								controls
								playsInline
								poster={featuredImage?.node?.sourceUrl}
							/>
						))}
					{!videoFullUrl && featuredImage?.node?.sourceUrl && (
						<img
							className={styles.image}
							src={featuredImage.node.sourceUrl}
							alt={featuredImage.node.altText || title}
						/>
					)}
				</Container>
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

Component.queries = [
	{
		query: GET_LAYOUT_QUERY,
		variables: (seedNode, ctx) => ({
			headerLocation: MENUS.PRIMARY_LOCATION,
			footerLocation: MENUS.FOOTER_LOCATION,
		}),
	},
	{
		query: GET_VIDEO_QUERY,
		variables: ({ databaseId }, ctx) => ({
			databaseId,
			asPreview: ctx?.asPreview,
		}),
	},
];
