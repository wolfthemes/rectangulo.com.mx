import { gql } from '@apollo/client';
import Link from 'next/link';
import { useFaustQuery } from '@faustwp/core';
import { Container, Footer, Header, Heading, Main, NavigationMenu, SEO } from '../components';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { FeaturedImage } from '../components/FeaturedImage';
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
const GET_WORK_QUERY = gql`
	${FeaturedImage.fragments.entry}
	query GetWork($databaseId: ID!, $asPreview: Boolean = false) {
		work(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			workClient
			workYear
			workObjetivo
			workAlcance
			workFormato
			workResultado
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
	if (props.loading) {
		return <>Loading...</>;
	}

	const { work } = useFaustQuery(GET_WORK_QUERY);
	const { generalSettings, headerMenuItems, footerMenuItems } = useFaustQuery(GET_LAYOUT_QUERY);

	const { title: siteTitle, description: siteDescription } = generalSettings ?? {};
	const primaryMenu = headerMenuItems?.nodes ?? [];
	const footerMenu = footerMenuItems?.nodes ?? [];
	const { title, featuredImage } = work ?? {};

	return (
		<>
			<SEO title={title ? `${title} — ${siteTitle}` : siteTitle} description={siteDescription} imageUrl={featuredImage?.node?.sourceUrl} />
			<Header title={siteTitle} description={siteDescription} menuItems={primaryMenu} />
			<Main>
				<Container>
					<Heading level="h1" className={styles.title}>
						{title}
					</Heading>
					{featuredImage?.node?.sourceUrl && (
						<img
							className={styles.image}
							src={featuredImage.node.sourceUrl}
							alt={featuredImage.node.altText || title}
						/>
					)}
					<dl className={styles.meta}>
						{metaRows(work).map(([label, value]) => (
							<div className={styles.row} key={label}>
								<dt className={styles.label}>{label}</dt>
								<dd className={styles.value}>
									{Array.isArray(value)
										? value.map((term, index) => (
												<span key={term.uri}>
													{index > 0 && ', '}
													<Link href={term.uri}>{term.name}</Link>
												</span>
											))
										: value}
								</dd>
							</div>
						))}
					</dl>
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
