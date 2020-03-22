const buildTools = require('@webpack-common/build-tools');
const cOut = require('@build-utils/custom-output');
const helpers = require('@webpack-common/helpers');
const path = require('path');
const pkg = require('@root/package.json');
const urlJoin = require('url-join');

let runtimeCfg;

module.exports = function (env) {
    if (!env.resrc) {
        console.log(cOut.fatal('Can\'t run the build - env.resrc must be set, otherwise there are no resources to build with.'));
        process.exit();
    }

    if (!runtimeCfg) {
        let nodeEnv = process.env.ENV;
        let resrcSrc = env.resrc;
        let resrcRoot = pkg.directories.webpackTempBuildBase;
        let settingsFilename = (env && env.settings) || "settings.json";
        let settingsFilepath = helpers.joinPathFromRoot(resrcRoot, settingsFilename);
        let appSettings = require(helpers.joinPathFromRoot(resrcSrc, settingsFilename));
        let sassFontCfg = buildTools.parseFontConfigToSass(appSettings.font);
        let contentRoot = appSettings.url[nodeEnv].contentRoot;
        let dataRoot = appSettings.url[nodeEnv].dataRoot;
        let isDev = process.env.ENV === 'dev';
        let outputBaseAsset = isDev ? './' : path.resolve(resrcSrc, appSettings.build.outputBase[process.env.ENV], 'asset');
        let outputBaseSite = isDev ? './' : path.resolve(resrcSrc, appSettings.build.outputBase[process.env.ENV]);
        let outputBaseSiteData = path.join(outputBaseSite, 'site-data');

        if (process.env.ENV === 'dev') {
            contentRoot = urlJoin(resrcRoot, contentRoot);
            dataRoot = urlJoin(resrcRoot, dataRoot);
        }

        runtimeCfg = {
            appSettings,
            breakpoint: pkg.breakpoint,
            sassLoaderBaseData: `$ENV_BREAKPOINT_XS: ${pkg.breakpoint.xs};
                            $ENV_BREAKPOINT_SM: ${pkg.breakpoint.sm};
                            $ENV_BREAKPOINT_MD: ${pkg.breakpoint.md};
                            $ENV_BREAKPOINT_LG: ${pkg.breakpoint.lg};
                            $ENV_BREAKPOINT_XL: ${pkg.breakpoint.xl};
                            $ENV_FONT_CONFIG: ${sassFontCfg};`,
            path: {
                contentRoot,
                dataRoot,
                outputBaseAsset,
                outputBaseSite,
                outputBaseSiteData,
                pkgJsonDirs: pkg.directories,
                pkgJsonResrc: pkg.resources,
                resrcRoot,
                resrcSrc,
                settingsFilename,
                settingsFilepath
            },
            version: pkg.version
        };
    }

    return runtimeCfg;
};
