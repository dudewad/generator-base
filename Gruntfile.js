"use strict";
const fs = require("fs");
const path = require("path");
const cOut = require('./config/build-utils/custom-output');

function filterDefinedTasks(grunt, taskList) {
	if (Array.isArray(taskList)) {
		return taskList.filter(function (el) {
			//Tasks are defined by their top-level names, not sub-tasks, so need to parse off colon.
			return grunt.config.get(el.split(":")[0]);
		});
	}

	return taskList;
}

/**
 * This method will load all task configurations dynamically from the
 * specified directory.
 *
 * @param {Object} grunt        The Grunt object
 * @param {String} path         The path to the task configuration settings files
 * @returns {{}}
 */
function loadTaskConfigurations(grunt, path) {
	let glob = require('glob');
	let configs = {};
	let key;

	//Gets all task config items and imports them to the configs object
	glob.sync('*', {cwd: path}).forEach(function (option) {
		key = option.replace(/\.js$/, '');
		let cfg = require(process.cwd() + "/" + path + option);
		configs[key] = typeof cfg === 'function' ? cfg(grunt) : cfg;
	});

	return configs;
}

/**
 * Kick off the Grunt module
 * @param {Object} grunt            The Grunt object
 */
module.exports = function (grunt) {
	let resourcesRoot = grunt.option("resourcesRoot") || '../';
	let settingsJson = grunt.option("settings") || "settings.json";
	let settingsFilepath = path.join(resourcesRoot, settingsJson);
	let customSettingsFile;
	//Need to cache old grunt.registerTask so it can be extended
	let regTask = grunt.registerTask;
	//This is an augmentation of the grunt.registerTask method.
	//In summary, it makes grunt.registerTask allow for task arrays to be passed that have task names defined
	//that have no value. Why? Because that means now we can define tasks as functions that return either
	//a task configuration object or a falsey value and not run into errors. filterDefinedTasks will not
	//register tasks that have no defined value. That means we can define task aliases without having to
	//remember to filter out invalid values, basically allowing "normal" grunt usage to go on
	//exactly as before.
	grunt.registerTask = function (name, taskOrDesc, task) {
		if (typeof taskOrDesc === "string") {
			regTask(name, taskOrDesc, filterDefinedTasks(grunt, task));
		}
		else {
			regTask(name, filterDefinedTasks(grunt, taskOrDesc));
		}
	};

	//Run initial Grunt config
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		directories: "<%= pkg.directories %>"
	});

	//Get build-specific settings and add them to the config under "config.customSettings"
	try {
		customSettingsFile = fs.readFileSync(settingsFilepath);
	}
	catch(e) {
		grunt.log.writeln(cOut.fatal(`\nGrunt settings filepath was invalid! Error is below. Aborting.\n${e}`));
		process.exit(1);
	}
	grunt.config.merge({
		customSettings: JSON.parse(customSettingsFile),
		resourcesRoot
	});

	//Load all task configurations
	let taskConfigurations = loadTaskConfigurations(grunt, grunt.config.get("pkg.directories.grunt.taskConfig"));

	//Add those task configurations to the grunt config
	for (let taskName in taskConfigurations) {
		grunt.config.set(taskName, taskConfigurations[taskName]);
	}

	//Gets all defined tasks from the defined tasks directory
	grunt.loadTasks(grunt.config.get("pkg.directories.grunt.aliasTask"));

	//Load all tasks from devDependencies.
	//See load-grunt-tasks documentation for specific customization options.
	require("load-grunt-tasks")(grunt);
};