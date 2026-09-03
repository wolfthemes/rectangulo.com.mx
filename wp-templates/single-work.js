import { gql } from '@apollo/client';
import Link from 'next/link';
import { useFaustQuery } from '@faustwp/core';
import { Container, Footer, Header, Heading, Main, NavigationMenu, SEO } from '../components';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { FeaturedImage } from '../components/FeaturedImage';
import { youtubeId } from '../lib/youtube';
import { getSafeHttpUrl } from '../utils/urls';
import styles from './single-work.module.scss';

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
// (register-work-fields.php on the rectangulo-headless-theme repo), plus the
// Tipo (WorkType) and Servicios (WorkService) taxonomy terms. Servicios link
// to their taxonomy archive (wp-templates/taxonomy.js); Tipo is plain text —
// no archive page requested for it yet.
//
// Queried through the generic contentNode lookup rather than a dedicated
// `work(id: ...)` root field — same wolf-portfolio/WPGraphQL gap hit on
// amla-frontend (works/workTypes connections and the Work type itself
// resolve fine; only that one specific root field doesn't reliably, and
// only once actually deployed — works locally, 500s on staging). contentNode
// is the same generic node-by-id lookup WPGraphQL itself uses under the
// hood, aliased to `work` so the rest of this file is unchanged.
const GET_WORK_QUERY = gql`
	${FeaturedImage.fragments.entry}
	query GetWork($databaseId: ID!, $asPreview: Boolean = false) {
		work: contentNode(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			... on Work {
				title
				workClient
				workYear
				workObjetivo
				workAlcance
				workFormato
				workResultado
				workVideoUrl
				workTypes {
					nodes {
						name
					}
				}
				workServices {
					nodes {
						name
						uri
					}
				}
				...FeaturedImageFragment
			}
		}
	}
`;

// Label/value pairs, in display order. Rows with no value are skipped.
function metaRows(work) {
	return [
		['Tipo', work?.workTypes?.nodes?.map((node) => node.name).join(', ')],
		['Cliente', work?.workClient],
		['Objetivo', work?.workObjetivo],
		['Alcance', work?.workAlcance],
		['Formato', work?.workFormato],
		['Servicios', work?.workServices?.nodes?.length ? work.workServices.nodes : null],
		['Resultado', work?.workResultado],
		['Año', work?.workYear],
	].filter(([, value]) => value);
}

export default function Component(props) {
	// Hooks must run unconditionally on every render (rules-of-hooks) — the
	// `?? {}` covers the render(s) before FaustContext has this query's
	// result yet (e.g. props.loading, or a Link prefetch racing the fetch).
	const { work } = useFaustQuery(GET_WORK_QUERY) ?? {};
	const { generalSettings, headerMenuItems, footerMenuItems } =
		useFaustQuery(GET_LAYOUT_QUERY) ?? {};

	if (props.loading) {
		return <>Loading...</>;
	}

	const { title: siteTitle, description: siteDescription } = generalSettings ?? {};
	const primaryMenu = headerMenuItems?.nodes ?? [];
	const footerMenu = footerMenuItems?.nodes ?? [];
	const { title, featuredImage, workVideoUrl } = work ?? {};
	const ytId = youtubeId(workVideoUrl);
	const safeWorkVideoUrl = getSafeHttpUrl(workVideoUrl);

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
					<div className={styles.hero}>
						<dl className={styles.meta}>
							{metaRows(work).map(([label, value]) => (
								<div className={styles.row} key={label}>
									<dt className={styles.label}>{label}</dt>
									<dd className={styles.value}>
										{Array.isArray(value)
											? value.map((term, index) => (
													<span key={term.uri}>
														{index > 0 && ', '}
														<Link className={styles.serviceLink} href={term.uri}>
															{term.name}
														</Link>
													</span>
												))
											: value}
									</dd>
								</div>
							))}
						</dl>
						<div className={styles.media}>
							{workVideoUrl ? (
								ytId ? (
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
										src={safeWorkVideoUrl}
										controls
										playsInline
										poster={featuredImage?.node?.sourceUrl}
									/>
								)
							) : (
								featuredImage?.node?.sourceUrl && (
									<img
										className={styles.image}
										src={featuredImage.node.sourceUrl}
										alt={featuredImage.node.altText || title}
									/>
								)
							)}
						</div>
					</div>
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
		query: GET_WORK_QUERY,
		variables: ({ databaseId }, ctx) => ({
			databaseId,
			asPreview: ctx?.asPreview,
		}),
	},
];
