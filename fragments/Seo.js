import { gql } from '@apollo/client';

// Fields buildSeo reads off any WP content node (dates for JSON-LD). Spread
// into every single-entry query; titles/excerpts/images come from the query.
export const SeoFragment = gql`
	fragment SeoFragment on ContentNode {
		uri
		dateGmt
		modifiedGmt
	}
`;
