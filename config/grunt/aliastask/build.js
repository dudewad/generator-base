"use strict";

/**
 * Grunt alias task - build
 */
module.exports = function (grunt) {
	grunt.registerTask("build:dev", [
		"clean",
		"webfont:dev"
	]);

	grunt.registerTask("build:staging", [
		"clean",
		"webfont:staging"
	]);

	grunt.registerTask("build:prod", [
		"clean",
		"webfont:prod"
	]);
};