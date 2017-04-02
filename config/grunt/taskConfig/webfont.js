"use strict";
/**
 * Grunt task configuration - grunt-webfont
 *
 * Note, this only supports one webfont per project, for now.
 */
const path = require('path');
const merge = require('deepmerge');
let codepoints = require('../include/webfont-codepoints');

function baseCfg(data) {
	return {
		src: `${data.fontRoot}/${data.font.name}/src/**/*.svg`,
		dest: `${data.fontRoot}/${data.font.name}/`,
		destCss: "<%= pkg.directories.scssRoot %>generated/",
		options: {
			autoHint: false,
			engine: "node",
			font: data.font.name,
			normalize: true,
			stylesheet: "scss",
			codepoints,
			templateOptions: {
				baseClass: data.font.name,
				classPrefix: `${data.font.name}-`
			}
		}
	};
}

module.exports = function(grunt) {
	let resourcesRoot = grunt.config('resourcesRoot');
	let customSettings = grunt.config('customSettings');
	let fontList = customSettings.font;
	let font = null;
	let fontRoot = customSettings.resources.fontRoot;

	for(let i = 0, len = fontList.length; i < len; i++){
		let f = fontList[i];
		if(f.generated) {
			font = f;
			break;
		}
	}

	try {
		let customCodepoints = require(path.join(process.cwd(), resourcesRoot, fontRoot, font.name, 'src', 'codepoints.js'));
		console.log(`Found custom codepoints file for webfont "${font.name}".`);
		for (let point in customCodepoints) {
			if (customCodepoints.hasOwnProperty(point) && codepoints.hasOwnProperty(point)) {
				console.warn(`##########\nWarning: Overwriting existing code point for webfont: ${point}. This is highly discouraged, as it will probably break something. Recommend using another value for this codepoint.\n##########\n`);
			}
		}
		codepoints = merge(codepoints, customCodepoints);
	}
	catch(e) {
		console.log(`No custom codepoints file found for webfont "${font.name}". Ok.`);
	}

	//Certain configs may not have an icon font defined. If not, bail.
	if(!font) {
		console.log('\nNo icon fonts found in custom settings. Skipping icon font generation task.\n');
		return false;
	}

	let baseCfgData = {
		font,
		fontRoot: path.join(resourcesRoot, fontRoot),
		fontRootSrc: path.join(resourcesRoot, fontRoot),
		fontRootDest: path.join(customSettings.resources.contentRoot, fontRoot)
	};
	let relPathSuffix = `<%= customSettings.url.relative.font %>${font.name}/`;
	let devCfg = baseCfg(baseCfgData);
	let stagingCfg = baseCfg(baseCfgData);
	let prodCfg = baseCfg(baseCfgData);
	devCfg.options.relativeFontPath = `<%= customSettings.url.dev.contentRoot %>${relPathSuffix}`;
	stagingCfg.options.relativeFontPath = `<%= customSettings.url.staging.contentRoot %>${relPathSuffix}`;
	prodCfg.options.relativeFontPath = `<%= customSettings.url.prod.contentRoot %>${relPathSuffix}`;


	return {
		dev: devCfg,
		staging: stagingCfg,
		prod: prodCfg
	}
};