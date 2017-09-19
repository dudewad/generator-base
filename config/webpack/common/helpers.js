"use strict";
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');

console.log(`Root directory: ${joinPathFromRoot()} \n`);

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

function joinPathFromRoot(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [ROOT].concat(args));
}

function version() {
    return require(joinPathFromRoot('package.json')).version;
}

module.exports = {
	getEnv,
	joinPathFromRoot,
	version: {
		v: version(),
		dtm: new Date()
	}
};