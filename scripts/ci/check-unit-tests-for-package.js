#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

const { execSync } = require( 'child_process' );
const upath = require( 'upath' );
const minimist = require( 'minimist' );

const CKEDITOR5_ROOT_DIRECTORY = upath.join( __dirname, '..', '..' );

main();

function main() {
	const { packageName, checkCoverage, allowNonFullCoverage } = getOptions( process.argv.slice( 2 ) );

	runTests( { packageName, checkCoverage } );

	if ( checkCoverage && !allowNonFullCoverage ) {
		const exitCode = checkCodeCoverage();

		process.exit( exitCode );
	}
}

/**
 * @param {Object} options
 * @param {String} options.packageName
 * @param {Boolean} options.checkCoverage
 */
function runTests( { packageName, checkCoverage } ) {
	const shortName = packageName.replace( /^ckeditor5?-/, '' );

	const testCommand = [
		'yarn',
		'test',
		'--reporter=dots',
		'--production',
		`-f ${ shortName }`,
		checkCoverage ? '--coverage' : null
	].filter( Boolean );

	execSync( testCommand.join( ' ' ), {
		cwd: CKEDITOR5_ROOT_DIRECTORY,
		stdio: 'inherit'
	} );
}

function checkCodeCoverage() {
	execSync( 'cp coverage/*/coverage-final.json .nyc_output', {
		cwd: CKEDITOR5_ROOT_DIRECTORY,
		stdio: 'inherit'
	} );

	try {
		execSync( 'npx nyc check-coverage --branches 100 --functions 100 --lines 100 --statements 100', {
			cwd: CKEDITOR5_ROOT_DIRECTORY,
			stdio: 'inherit'
		} );
	} catch ( err ) {
		return 1;
	}

	return 0;
}

/**
 * @param {Array.<String>} argv
 * @returns {Object} options
 * @returns {String} options.packageName
 * @returns {Boolean} options.checkCoverage
 * @returns {Boolean} options.allowNonFullCoverage
 */
function getOptions( argv ) {
	const options = minimist( argv, {
		string: [
			'package-name'
		],
		boolean: [
			'check-coverage',
			'allow-non-full-coverage'
		],
		default: {
			'allow-non-full-coverage': false
		}
	} );

	options.packageName = options[ 'package-name' ];
	options.checkCoverage = options[ 'check-coverage' ];
	options.allowNonFullCoverage = options[ 'allow-non-full-coverage' ];

	return options;
}
