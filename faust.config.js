import { setConfig } from '@faustwp/core';
import templates from './wp-templates';
import possibleTypes from './possibleTypes.json';

/**
 * @type {import('@faustwp/core').FaustConfig}
 **/
export default setConfig({
	templates,
	plugins: [],
	// Deprecated by Faust itself ("no longer be actively maintained") and not
	// something a public-facing site needs — it also fires a 401'ing
	// auth/token request and a repeated deprecation warning on every single
	// render (same fix applied to the sibling amla-frontend repo).
	possibleTypes,
});
