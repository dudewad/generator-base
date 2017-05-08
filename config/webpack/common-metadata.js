const helpers = require("./utils/helpers");
const integrationTools = require('./utils/integration-tools');
const pkg = require(helpers.root('package.json'));
const sassImportFilename = pkg.directories.sassGeneratedRoot + pkg.resources.sassFontFileName;

module.exports = function(env) {
	let resourcesInfo = helpers.getResourcesInfo(env);
	let resourcesRoot = pkg.directories.webpackTempBuildBase;
	let settingsFilename = resourcesInfo.settingsFilename;
	let settingsFilepath = resourcesInfo.settingsFilepath;
	let customSettings = require(settingsFilepath);
	let SASS_FONT_CONFIG = integrationTools.parseFontConfigToSass(sassImportFilename, customSettings.font);

	return {
		FONT_RELATIVE_PATH: customSettings.url.relative.font,
		IMAGE_RELATIVE_PATH: customSettings.url.relative.image,
		BREAKPOINT: pkg.breakpoint,
		sassLoaderBaseData: `$ENV_BREAKPOINT_XS: ${pkg.breakpoint.xs};
							$ENV_BREAKPOINT_SM: ${pkg.breakpoint.sm};
							$ENV_BREAKPOINT_MD: ${pkg.breakpoint.md};
							$ENV_BREAKPOINT_LG: ${pkg.breakpoint.lg};
							$ENV_BREAKPOINT_XL: ${pkg.breakpoint.xl};
							$ENV_FONT_CONFIG: ${SASS_FONT_CONFIG};`,
		resourcesRoot,
		settingsFilename,
		settingsFilepath
	};
};