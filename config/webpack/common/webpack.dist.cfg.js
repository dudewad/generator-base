/**
 * This config is used in dist configurations only (i.e. prod, staging, etc). It is special because it only deals with
 * builds that are actually output to physical files. The dev server configuration(s) handle all files in memory and
 * therefore should not include this configuration set.
 *
 * This config is based on the webpack base config, as are all others. Build configs that consume this config should not
 * also include the base config as it is built into this one.
 */

"use strict";

const path = require('path');
const runtimeCfg = require('@webpack-common/runtime.cfg');
const webpackBaseCfg = require('@webpack-common/webpack.base.cfg');
const webpackMerge = require('webpack-merge');

/**
 * Plugins
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = function (env) {
    let cfg = runtimeCfg(env);

    return webpackMerge(webpackBaseCfg(env), {
        plugins: [
            new UglifyJsPlugin(),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(cfg.path.resrcRoot, cfg.appSettings.resources.contentRoot),
                    to: cfg.path.outputBaseAsset,
                    ignore: ['**/src/*']
                },
                {
                    from: path.resolve(cfg.path.resrcRoot, cfg.appSettings.resources.dataRoot),
                    to: cfg.path.outputBaseSiteData
                },
                {
                    from: path.resolve(cfg.path.resrcRoot, cfg.appSettings.resources.favicon),
                    to: cfg.path.outputBaseSite
                },
                {
                    from: path.resolve(cfg.path.resrcRoot, cfg.appSettings.server.htaccess),
                    to: cfg.path.outputBaseSite
                }
            ])
        ],
        output: {
            path: cfg.path.outputBaseSite,
            filename: '[name].bundle.js',
            sourceMapFilename: '[file].map',
            chunkFilename: '[id].chunk.js'
        }
    });
};
