'use strict';
const fs = require('fs-extra');
const ncp = require('ncp');
const path = require('path');
const helpers = require('./helpers');
const pkg = require(helpers.root() + '/package.json');

function copyResourcesToTemp(env) {
	let tempBase = pkg.directories.webpackTempBuildBase;
	if(!env || !env.resourcesRoot) {
		console.log("Cannot copy resources -- env.resourcesRoot must be defined. Consult the docs for more. Aborting webpack build.");
		process.exit();
	}

	fs.removeSync(tempBase);

	console.log(`Cleaned base Webpack base content temp directory. Copying content files...`);
	try{
		fs.copySync(path.join(helpers.root(env.resourcesRoot)), helpers.root(tempBase));
	}
	catch (err) {
		console.log(`Copying resources to webpack temp directory failed when copying from ${env.resourcesRoot} to ${tempBase} Aborting.`, err);
		console.log(`Make sure that you have passed a valid env.resourcesRoot to the webpack call.`);
		process.exit();
		return;
	}
	console.log("Successfully copied resources to temp base.");
}

function renameSassOverridesEntryPoint(src, dest) {
	fs.rename(src, dest, function (err) {
		if (err) {
			console.log("Could not rename SASS entry point. Aborting.", err);
			process.exit();
			return;
		}
		console.log("Successfully renamed SASS overrides entry point.");
	})
}

function buildSassFontFile(filename, fonts) {
	let str = '';
	for (let i = 0, len = fonts.length; i < len; i++) {
		let font = fonts[i];
		if (font.generated) {
			str += `@import "./${font.name}";\n`;
		}
	}

	fs.writeFileSync(filename, str);
}

/**
 * Parses any fonts from the custom settings config marked as 'webfont' into a SASS map string to be imported into
 * the SASS env so it can be built as an icon font.
 *
 * @param importFilename
 * @param fonts
 * @returns {string}
 */
function parseFontConfigToSass(importFilename, fonts) {
	buildSassFontFile(importFilename, fonts);
	let masterStr = "(";

	for (let i = 0, len = fonts.length; i < len; i++) {
		let font = fonts[i];

		switch(font.type) {
			case 'webfont':

				let formats = font.formats;
				let formatStr = '';

				for (let j = 0; j < formats.length; j++) {
					let format = formats[j];
					formatStr += `(
						name: "${format.name}",
						extension: "${format.extension}"
					)`;
					if (j + 1 < formats.length) {
						formatStr += ",";
					}
				}

				masterStr += `(
					type: "webfont",
					name: "${font.name}",
					formats: (${formatStr}),
					weight: "${font.weight}",
					style: "${font.style}"
				),`;
				break;
			case 'import':
				masterStr += `(
					type: "import",
					name: "${font.name}",
					url: "${font.url}"
				),`;
				break;
		}
	}
	//Remove last comma, add ')' to close the list. Don't move this inside the loop, not
	//all fonts are generated and will break it.
	masterStr = masterStr.slice(0, masterStr.length - 1) + ')';
	return masterStr;
}

function importStyleOverrides(srcBase, srcEntry){
	//TODO: Nuke original overrides folder to regen ('clean', effectively).
	let dirs = pkg.directories;
	let src = srcBase;
	let dest = helpers.root(path.join(dirs.sassGeneratedRoot, dirs.sassOverridesBase));
	let srcEntryPoint = path.join(dest, srcEntry);
	let destEntryPoint = path.join(dest, pkg.resources.sassOverridesEntryPoint);

	ncp(src, dest, function(err) {
		if(err) {
			console.log("Copying style overrides file failed! You must specify a valid base dir with an entry point file for SASS overrides, even if it is empty, in your settings.json file. Aborting build.", err);
			process.exit();
			return;
		}
		console.log("Successfully copied SASS override resources.");

		renameSassOverridesEntryPoint(srcEntryPoint, destEntryPoint);
	});
}

module.exports = {
	copyResourcesToTemp,
	importStyleOverrides,
	parseFontConfigToSass
};