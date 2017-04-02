"use strict";
const path = require('path');
const fs = require('fs-extra');
const ROOT = path.resolve(__dirname, '../../..');
const pkg = require(root('package.json'));

console.log('root directory:', root() + '\n');

function hasProcessFlag(flag) {
    return process.argv.join('').indexOf(flag) > -1;
}

function getEnv() {
	let env = {};
	let args = process.argv.slice(2);
	for (let i = 0; i < args.length; i++) {
		let str = args[i];
		if(str.indexOf('--env.') === 0) {
			let flag = str.substring(6);
			let segs = flag.split("=");
			let key = segs.shift();
			env[key] = segs.join('=');
		}
	}
	return env;
}

function getResourcesInfo(env) {
	let resourcesRoot = pkg.directories.webpackTempBuildBase;
	let settingsFilename = (env && env.settings) || "settings.json";
	let settingsFilepath = root(resourcesRoot, settingsFilename);

	return {
		resourcesRoot,
		settingsFilename,
		settingsFilepath
	}
}

function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [ROOT].concat(args));
}

function version() {
    return require(root('package.json')).version;
}

module.exports = {
	getEnv,
	getResourcesInfo,
	hasProcessFlag,
	root,
	version: {
		v: version(),
		dtm: new Date()
	}
};