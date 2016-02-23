/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/**
 * Basic HTML writer, it uses the native `innerHTML` property for basic conversion
 * from DocumentFragment to an HTML string.
 *
 * @memberOf core.dataProcessor
 * @implements core.dataProcessor.HtmlWriter
 */
export default class BasicHtmlWriter {
	/**
	 * Returns HTML string created from DocumentFragment.
	 *
	 * @param {DocumentFragment} fragment
	 * @returns {String}
	 */
	getHtml( fragment ) {
		const doc = document.implementation.createHTMLDocument( '' );
		const container = doc.createElement( 'div' );
		container.appendChild( fragment );

		return container.innerHTML;
	}
}
