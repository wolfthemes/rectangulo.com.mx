import { gql, useQuery } from '@apollo/client';
import classNames from 'classnames/bind';
import * as MENUS from '../../constants/menus';
import { BlogInfoFragment } from '../../fragments/GeneralSettings';
import { Header, Footer, Main, SEO, NavigationMenu, Container, Heading } from '../../components';
import styles from './LegalPage.module.scss';

let cx = classNames.bind(styles);

// Shared shell for /privacy and /cookies (HOME brief p.10: legal links in the
// footer). Body copy is the client's to supply — never invent legal text.
export default function LegalPage({ title, children }) {
	const { data } = useQuery(LegalPage.query, {
		variables: { headerLocation: MENUS.PRIMARY_LOCATION, footerLocation: MENUS.FOOTER_LOCATION },
	});

	const { title: siteTitle, description: siteDescription } = data?.generalSettings ?? {};

	return (
		<>
			<SEO title={`${title} — ${siteTitle ?? 'Rectángulo'}`} description={siteDescription} />
			<Header title={siteTitle} description={siteDescription} menuItems={data?.headerMenuItems?.nodes ?? []} />
			<Main>
				<Container>
					<div className={cx('component')}>
						<Heading level="h1" className={cx('heading')}>
							{title}
						</Heading>
						{children ?? <p>[À FOURNIR : texte légal — {title}]</p>}
					</div>
				</Container>
			</Main>
			<Footer title={siteTitle} menuItems={data?.footerMenuItems?.nodes ?? []} />
		</>
	);
}

LegalPage.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	query GetLegalPageChrome($headerLocation: MenuLocationEnum, $footerLocation: MenuLocationEnum) {
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
